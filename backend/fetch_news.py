import requests
import os
from dotenv import load_dotenv

from database import SessionLocal
from models import Article

# Load environment variables
load_dotenv()

API_KEY = os.getenv("NEWSDATA_API_KEY")

url = "https://newsdata.io/api/1/news"

# Database session
db = SessionLocal()

# Categories
categories = [
    "technology",
    "business",
    "health",
    "science",
    "world"
]

# Fetch articles category-wise
for category in categories:

    print(f"\nFetching category: {category}")

    next_page = None

    # Fetch 3 pages per category
    for i in range(3):

        print(f"\nFetching page {i + 1}")

        params = {
            "apikey": API_KEY,
            "language": "en",
            "category": category
        }

        # Add pagination token
        if next_page:
            params["page"] = next_page

        try:

            response = requests.get(url, params=params)

            data = response.json()
            #print(data)

            articles = data.get("results", [])

            next_page = data.get("nextPage")

            for article in articles:

                # Skip invalid article data
                if not isinstance(article, dict):
                    print("Invalid article skipped")
                    continue

                # Skip articles without title
                if not article.get("title"):
                    print("Article without title skipped")
                    continue

                # Deduplication check
                existing_article = db.query(Article).filter(
                        (
                            Article.link == article.get("link", "")
                        ) |
                        (
                            Article.title == article.get("title", "")
                        )
                 ).first()

                if existing_article:
                    print("Duplicate skipped")
                    continue

                # Create article object
                new_article = Article(
                    title=article.get("title"),
                    description=article.get("description"),
                    source=article.get("source_id"),
                    category=category,
                    published_date=article.get("pubDate"),
                    link=article.get("link")
                )

                db.add(new_article)

            # Save to database
            db.commit()

            print(f"{len(articles)} articles processed")

        except Exception as e:
            print("Error:", e)

# Close DB connection
db.close()

print("\nAll pages fetched successfully!")