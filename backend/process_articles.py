from database import SessionLocal
from models import Article
from ai_processor import analyze_article


def normalize_sentiment(sentiment):

    sentiment = sentiment.lower()

    positive_words = [
        "positive",
        "heartwarming",
        "optimistic",
        "hopeful",
        "inspiring",
        "exciting"
    ]

    negative_words = [
        "negative",
        "disturbing",
        "dire",
        "fearful",
        "alarming",
        "sad"
    ]

    neutral_words = [
        "neutral",
        "informative",
        "reflective",
        "curious",
        "analytical",
        "mixed"
    ]

    if sentiment in positive_words:
        return "Positive"

    elif sentiment in negative_words:
        return "Negative"

    else:
        return "Neutral"

db = SessionLocal()

# Only fetch articles without summaries
articles = db.query(Article).filter(
    Article.summary == None
).all()

print(f"Found {len(articles)} unprocessed articles")

for article in articles:

    print(f"\nProcessing: {article.title}")

    article_text = f"""
    Title: {article.title}

    Description:
    {article.description}
    """

    try:

        result = analyze_article(article_text)

        print(result)

        sentiment = ""
        summary = ""
        insights = ""

        sentiment = result.split("SENTIMENT:")[1].split("SUMMARY:")[0].strip()

        summary = result.split("SUMMARY:")[1].split("INSIGHTS:")[0].strip()

        insights = result.split("INSIGHTS:")[1].strip()

        article.sentiment = normalize_sentiment(sentiment)
        article.summary = summary
        article.insights = insights

        db.commit()

        print("Saved successfully")

    except Exception as e:

        print("Error processing article")
        print(e)

        continue

db.close()

print("\nAll articles processed successfully!")