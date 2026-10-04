import { Prompt } from "next/font/google"
import { JPSection } from "@components/Forms/JPSection"
const prompt = Prompt({subsets: ['latin'], weight : '400'})

const JPConfig = () => {
  return (
    <div style={prompt.style}>
      <JPSection />
    </div>
  )
}

export default JPConfig