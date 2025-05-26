import { Button } from "../../components/Button"
import { Input } from "../../components/Input"

type ChatMessageFormProps = {
  onSubmit: (message: string) => void
}

export const ChatMessageForm = ({ onSubmit }: ChatMessageFormProps) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const message = (e.target as HTMLFormElement).message.value
        if (message) {
          onSubmit(message);
          // Clear the input field after submission
          (e.target as HTMLFormElement).reset()
        }
      }}
    >
      <Input type="text" name="message" placeholder="Type message" required />
      <Button type="submit">Send</Button>
    </form>
  )

}