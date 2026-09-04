import os
from pydantic_settings import BaseSettings
from pydantic import Field

# Events data for API endpoint
eventsData = [
    {
        "id": "project-expo",
        "title": "Project Expo",
        "type": "TECHNICAL",
        "badge": "FLAGSHIP EVENT",
        "tagline": "Unveil cutting-edge hardware prototypes and software innovations.",
        "shortDesc": "A national-level innovation showcase where visionary students present functional prototypes across AI/ML, IoT, Web3, Robotics, and Embedded Systems before industry experts.",
        "coverImage": "/placeholder.jpg",
        "accentColor": "#06b6d4",
        "teamSize": "2 - 3 Members",
        "date": "25.09.2026",
        "time": "10:00 AM - 01:30 PM",
        "venue": "IT Innovation Center",
        "hasCashPrize": True,
        "prizePool": "₹10,000 Cash Prize",
        "overview": "Present innovative projects to industry experts."
    },
    {
        "id": "ui-ux",
        "title": "UI/UX Designathon",
        "type": "TECHNICAL",
        "badge": "DESIGN SPRINT",
        "tagline": "Craft intuitive interfaces, micro-interactions, and visual design masterpieces.",
        "shortDesc": "A fast-paced interactive design challenge where designers tackle a live real-world problem statement to architect high-fidelity Figma prototypes and design systems.",
        "coverImage": "/placeholder.jpg",
        "accentColor": "#8b5cf6",
        "teamSize": "2 - 3 Members",
        "date": "25.09.2026",
        "time": "02:00 PM - 04:30 PM",
        "venue": "CAD Design Studio & Multimedia Lab",
        "hasCashPrize": False,
        "prizePool": "Winner Trophy + Certificate of Merit + Design Swag",
        "overview": "A 2-hour UI/UX design challenge where participants are given a problem statement on the spot."
    },
    {
        "id": "logic-hunt",
        "title": "Logic Hunt",
        "type": "TECHNICAL",
        "badge": "ALGO-QUEST",
        "tagline": "Crack cryptic ciphers, debug broken codebases, and conquer the algorithmic maze.",
        "shortDesc": "A multi-tier algorithmic code quest where programmers follow cyber breadcrumbs, fix obfuscated codebases, and crack logic puzzles to unearth the master key.",
        "coverImage": "/placeholder.jpg",
        "accentColor": "#3b82f6",
        "teamSize": "2 - 3 Members",
        "date": "25.09.2026",
        "time": "10:00 AM - 12:30 PM",
        "venue": "Advanced Coding Lab 2 & Server Room",
        "hasCashPrize": False,
        "prizePool": "Champion Trophy + Certificate of Merit + Algo Badges",
        "overview": "A 3-round technical event testing your problem-solving skills across basic logical questions, debugging, and code logic challenges."
    },
    {
        "id": "who-am-i",
        "title": "Who Am I?",
        "type": "NON-TECHNICAL",
        "badge": "DEDUCTION SHOWDOWN",
        "tagline": "Test your sharp instincts, deductive reasoning, and pop-culture tech mastery.",
        "shortDesc": "A captivating 20-questions mystery showdown where players unmask iconic tech legends, pop culture titans, sci-fi movies, and quirky personas against the clock.",
        "coverImage": "/placeholder.jpg",
        "accentColor": "#ec4899",
        "teamSize": "2 - 3 Members",
        "date": "25.09.2026",
        "time": "11:30 AM - 01:00 PM",
        "venue": "Open Amphitheatre / Seminar Hall 1",
        "hasCashPrize": False,
        "prizePool": "Winner Trophy + Certificate of Merit + Gift Hampers",
        "overview": "A 3-round non-technical event testing your pop-culture knowledge, quick thinking, and deduction skills."
    },
    {
        "id": "rapid-fire",
        "title": "Rapid Fire",
        "type": "NON-TECHNICAL",
        "badge": "LIGHTNING TRIVIA",
        "tagline": "Lightning buzzers, instant wit, and split-second pop & tech trivia.",
        "shortDesc": "A buzzer-driven quiz arena packed with fast-paced questions, music riffs, tech logos, viral memes, and general knowledge where hesitations cost victory.",
        "coverImage": "/placeholder.jpg",
        "accentColor": "#f59e0b",
        "teamSize": "2 - 3 Members",
        "date": "25.09.2026",
        "time": "11:00 AM - 12:30 PM",
        "venue": "Main University Auditorium",
        "hasCashPrize": False,
        "prizePool": "Winner Trophy + Certificate of Merit + Fest Merchandise",
        "overview": "A lightning-fast quiz event covering Technology, Apps, Social Media, Entertainment, and General Knowledge."
    },
    {
        "id": "free-fire",
        "title": "Free Fire",
        "type": "NON-TECHNICAL",
        "badge": "ESPORTS ARENA",
        "tagline": "Drop in, survive, and conquer the battlefield.",
        "shortDesc": "Compete in the ultimate Free Fire battle royale and clash squad tournament. Prove your skills and claim the Booyah!",
        "coverImage": "/placeholder.jpg",
        "accentColor": "#ef4444",
        "teamSize": "2 - 3 Members",
        "date": "25.09.2026",
        "time": "02:00 PM - 04:00 PM",
        "venue": "Gaming Arena",
        "hasCashPrize": True,
        "prizePool": "Winner Trophy + Certificate of Merit + Cash Prize",
        "overview": "Get ready for intense action in the Free Fire Esports tournament!"
    }
]

class Settings(BaseSettings):
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    RAZORPAY_KEY_ID: str = Field(..., env="RAZORPAY_KEY_ID")
    RAZORPAY_KEY_SECRET: str = Field(..., env="RAZORPAY_KEY_SECRET")
    RAZORPAY_WEBHOOK_SECRET: str = Field(..., env="RAZORPAY_WEBHOOK_SECRET")
    GOOGLE_SHEET_ID: str = Field(..., env="GOOGLE_SHEET_ID")
    GOOGLE_SERVICE_ACCOUNT_JSON_BASE64: str = Field(..., env="GOOGLE_SERVICE_ACCOUNT_JSON_BASE64")
    SMTP_HOST: str = Field(..., env="SMTP_HOST")
    SMTP_PORT: int = Field(587, env="SMTP_PORT")
    SMTP_USERNAME: str = Field(..., env="SMTP_USERNAME")
    SMTP_PASSWORD: str = Field(..., env="SMTP_PASSWORD")
    ORGANIZER_EMAIL: str = Field(..., env="ORGANIZER_EMAIL")
    APP_SECRET_KEY: str = Field(..., env="APP_SECRET_KEY")
    FRONTEND_URL: str = Field(..., env="FRONTEND_URL")

    class Config:
        env_file = ".env"

settings = Settings()