import React from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout.jsx"
import Scanner from "./pages/Scanner.jsx"
import History from "./pages/History.jsx"

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Scanner />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Layout>
  )
}
