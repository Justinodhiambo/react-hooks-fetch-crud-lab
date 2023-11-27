import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Fetch questions from the server when the component mounts
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:4000/questions");
        if (!response.ok) {
          throw new Error(`Failed to fetch questions: ${response.statusText}`);
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []); // Empty dependency array ensures this runs once on mount

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleQuestionAdded = async (newQuestion) => {
    try {
      // Send a POST request to create a new question
      const response = await fetch("http://localhost:4000/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) {
        throw new Error(`Failed to create a new question: ${response.statusText}`);
      }

      // Get the newly created question from the response
      const createdQuestion = await response.json();

      // Update state by adding the new question
      setQuestions([...questions, createdQuestion]);

      // Switch to the "List" page
      setPage("List");
    } catch (error) {
      console.error("Error creating a new question:", error);
    }
  };

  const handleQuestionDeleted = async (questionId) => {
    try {
      // Send a DELETE request to remove the question from the server
      const response = await fetch(`http://localhost:4000/questions/${questionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete the question: ${response.statusText}`);
      }

      // Update state by removing the deleted question
      setQuestions(questions.filter((question) => question.id !== questionId));
    } catch (error) {
      console.error("Error deleting the question:", error);
    }
  };

  return (
    <main>
      <AdminNavBar onChangePage={handlePageChange} />
      {page === "Form" ? (
        <QuestionForm onQuestionAdded={handleQuestionAdded} />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleQuestionDeleted}
        />
      )}
    </main>
  );
}

export default App;
