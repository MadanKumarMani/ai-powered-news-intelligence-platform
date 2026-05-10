from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def analyze_article(text):

    prompt = f"""
    Analyze this news article.

    Return response in EXACT format:

    SENTIMENT:
    one word only

    SUMMARY:
    2 concise sentences

    INSIGHTS:
    - insight 1
    - insight 2
    - insight 3

    Article:
    {text}
    """

    response = client.chat.completions.create(

        #model="llama-3.3-70b-versatile",
        model="llama-3.1-8b-instant",

        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]

    )

    return response.choices[0].message.content