import React from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Scanner from "./pages/Scanner"
import History from "./pages/History"

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
