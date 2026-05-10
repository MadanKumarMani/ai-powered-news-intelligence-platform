from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Article(Base):

    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)

    description = Column(Text)

    source = Column(String)

    category = Column(String)

    published_date = Column(String)

    link = Column(String)

    summary = Column(Text)

    sentiment = Column(String)

    insights = Column(Text)