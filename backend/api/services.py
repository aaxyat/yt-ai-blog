from typing import Dict
import json

import openai
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi
from django.conf import settings


class BlogGenerator:
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(
            api_key=api_key,
            base_url=settings.OPENAI_BASE_URL,
        )
        self.ydl = yt_dlp.YoutubeDL({"quiet": True})

    def get_video_info(self, url: str) -> Dict:
        """Extract video title and ID from YouTube URL"""
        try:
            info = self.ydl.extract_info(url, download=False)
            return {"title": info["title"], "video_id": info["id"]}
        except Exception as e:
            raise ValueError(f"Failed to fetch video info: {str(e)}")

    def get_transcript(self, video_id: str) -> str:
        """Get video transcript"""
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            return " ".join(segment["text"] for segment in transcript)
        except Exception as e:
            raise ValueError(f"Failed to fetch transcript: {str(e)}")

    def generate_blog(self, transcript: str, video_title: str) -> Dict:
        """Generate blog post using OpenAI-compatible API"""
        system_prompt = (
            "You are a professional blog writer. Create a unique blog post "
            "with a clear structure. Return only a JSON object with 'title' "
            "and 'content' fields. Each generation should be different "
            "even for the same input. Write comprehensive, detailed content."
        )

        user_prompt = (
            f"Topic: {video_title}\n\n"
            f"Reference content:\n{transcript[:8000]}\n\n"
            "Instructions:\n"
            "1. Write a unique, comprehensive blog post\n"
            "2. Use markdown formatting\n"
            "3. Include detailed explanations\n"
            "4. Add relevant examples\n"
            "5. Create multiple sections with subheadings\n"
            "6. Add a thorough conclusion\n"
            "7. Ensure this version is different from previous versions\n\n"
            "Format:\n"
            '{"title": "Unique Title", "content": "# Heading\\n\\nContent"}'
        )

        try:
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.9,
                max_tokens=8000,
                response_format={"type": "json_object"}
            )

            try:
                content = response.choices[0].message.content
                parsed_content = json.loads(content.strip())
                
                # Validate response structure
                if not isinstance(parsed_content, dict):
                    raise ValueError("Response is not a dictionary")
                
                if not all(k in parsed_content for k in ['title', 'content']):
                    raise ValueError("Missing required fields")
                
                return parsed_content

            except json.JSONDecodeError as e:
                print(f"JSON Parse Error: {str(e)}")
                print(f"Raw content: {content}")
                raise ValueError("Failed to parse AI response")

        except Exception as e:
            print(f"Generation Error: {str(e)}")
            raise ValueError(f"Failed to generate blog: {str(e)}")
