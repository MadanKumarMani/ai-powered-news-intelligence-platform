from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from database import SessionLocal
from models import Article

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")

def home():
    return {"message": "AI News Platform API Running"}


@app.get("/articles")

def get_articles():

    db = SessionLocal()

    articles = db.query(Article).all()

    results = []

    for article in articles:

        results.append({
            "id": article.id,
            "title": article.title,
            "description": article.description,
            "source": article.source,
            "category": article.category,
            "published_date": article.published_date,
            "link": article.link,
            "summary": article.summary,
            "sentiment": article.sentiment,
            "insights": article.insights
        })

    db.close()

    return results