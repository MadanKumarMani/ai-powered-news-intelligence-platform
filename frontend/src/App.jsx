import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    axios.get("http://127.0.0.1:8000/articles")

      .then((response) => {
        setArticles(response.data);
        setLoading(false);
      })

      .catch((error) => {
        console.log(error);
        setError("Failed to load articles");
        setLoading(false);
      });

  }, []);

  const filteredArticles = articles.filter((article) => {

    const matchesSearch = article.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesSentiment =
      sentimentFilter === "All" ||
      article.sentiment === sentimentFilter;

    return matchesSearch && matchesSentiment;

  });

  const getSentimentColor = (sentiment) => {

    if (sentiment === "Positive") {
      return "#16a34a";
    }

    if (sentiment === "Negative") {
      return "#dc2626";
    }

    return "#ca8a04";
  };

  return (

    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial"
      }}
    >

      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "60px",
          color: "white"
        }}
      >
        AI News Dashboard
      </h1>

      {/* Loading */}

      {loading && (
        <h2
          style={{
            textAlign: "center",
            color: "white"
          }}
        >
          Loading articles...
        </h2>
      )}

      {/* Error */}

      {error && (
        <h2
          style={{
            color: "red",
            textAlign: "center"
          }}
        >
          {error}
        </h2>
      )}

      {/* Main Dashboard */}

      {!loading && !error && (
        <>

          {/* Search Bar */}

          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid gray",
              fontSize: "16px",
              boxSizing: "border-box",
              backgroundColor: "#374151",
              color: "white"
            }}
          />

          {/* Sentiment Filter */}

          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "30px",
              borderRadius: "8px",
              border: "1px solid gray",
              fontSize: "16px",
              boxSizing: "border-box",
              backgroundColor: "#374151",
              color: "white"
            }}
          >

            <option value="All">All Sentiments</option>

            <option value="Positive">Positive</option>

            <option value="Neutral">Neutral</option>

            <option value="Negative">Negative</option>

          </select>

          {/* No Results */}

          {filteredArticles.length === 0 && (
            <h2
              style={{
                textAlign: "center",
                color: "white"
              }}
            >
              No articles found
            </h2>
          )}

          <h3
            style={{
              marginBottom: "20px",
              color: "white"
            }}
          >
            Total Articles: {filteredArticles.length}
          </h3>

          {/* Articles */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "20px"
            }}
          >
          {filteredArticles.map((article) => (

            <div
              key={article.id}
              style={{
                border: "1px solid #374151",
                padding: "20px",
                marginBottom: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                backgroundColor: "#111827",
                color: "white",
                transition: "0.3s",
                cursor: "pointer"

              }}

              onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
              }}

              onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
              }}
            >

              <h2
                style={{
                  marginBottom: "10px",
                  textAlign: "center"
                }}
              >
                {article.title}
              </h2>

              <p>
                <strong>Source:</strong> {article.source}
              </p>
              <p>
                <strong>Category:</strong> {article.category}
              </p>
              <p>
                <strong>Published:</strong> {article.published_date}
              </p>

              {/* Sentiment Badge */}

              <p>
                <strong>Sentiment:</strong>{" "}

                <span
                  style={{
                    backgroundColor: getSentimentColor(article.sentiment),
                    padding: "5px 10px",
                    borderRadius: "20px",
                    color: "white",
                    fontWeight: "bold"
                  }}
                >
                  {article.sentiment}
                </span>

              </p>

              {/* Summary */}

              <p>
                <strong>Summary:</strong>
              </p>

              <p
                style={{
                  lineHeight: "1.8",
                  fontSize: "16px"
                }}
              >
                {article.summary}
              </p>

              {/* Insights */}

              <p>
                <strong>Key Insights:</strong>
              </p>

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  backgroundColor: "#1f2937",
                  color: "#ffffff",
                  padding: "15px",
                  borderRadius: "8px",
                  overflowX: "auto",
                  lineHeight: "1.8",
                  fontSize: "15px"
                }}
              >
                {article.insights}
              </pre>

              {/* Link */}

              <a
                href={article.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "15px",
                  color: "#60a5fa",
                  textDecoration: "none",
                  fontWeight: "bold"
                }}
              >
                Read Full Article
              </a>

            </div>

          ))}
          </div>

        </>
      )}

    </div>
  );
}

export default App;