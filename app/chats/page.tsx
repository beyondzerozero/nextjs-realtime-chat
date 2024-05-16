"use client"
import { Database } from "@/types/supabasetype"
import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase/supabase"
import { v4 } from "uuid"
import { useSearchParams } from "next/navigation"
import ChatUI from "@/components/chats/chat"

export default function Chats() {
  const searchParams = useSearchParams()
  let channelName = searchParams.get("channel_name")!!
  const [inputText, setInputText] = useState("")
  const [inputName, setInputName] = useState("")
  const [messageText, setMessageText] = useState<Database["public"]["Tables"]["chats"]["Row"][]>([])

  const fetchRealtimeData = () => {
    try {
      supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "chats",
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const { created_at, id, message, uid, channel, name } = payload.new
              setMessageText((messageText) => [...messageText, { id, created_at, message, uid, channel, name }])
            }
          }
        )
        .subscribe()

      return () => supabase.channel(channelName).unsubscribe()
    } catch (error) {
      console.error(error)
    }
  }

  // 처음 실행할 때만 실행하기 위한 빈배열을 인수로 전달함
  useEffect(() => {
    (async () => {
      let allMessages = null
      try {
        const { data } = await supabase.from("chats").select("*").eq('channel', channelName).order("created_at")

        allMessages = data
      } catch (error) {
        console.error(error)
      }
      if (allMessages != null) {
        setMessageText(allMessages)
      }
    })()
    fetchRealtimeData()
  }, [])

  const onSubmitNewMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inputText === "") return
    try {
      let userID = localStorage.getItem("uid")
      if (userID == undefined) {
        userID = v4()
        localStorage.setItem("uid", userID)
      }
      let userName = "익명"
      if (inputName !== "") {
        userName = inputName
      }
      await supabase.from("chats").insert({ message: inputText, uid: userID, channel: channelName, name: userName })
    } catch (error) {
      console.error(error)
    }
    setInputText("")
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center p-2">
      <h1 className="text-3xl font-bold pt-5 pb-10">{channelName}</h1>
      <div className="w-full max-w-3xl mb-10 border-t-2 border-x-2">
        {messageText.map((item, index) => (
          <ChatUI chatData={item} index={index}></ChatUI>
        ))}
      </div>

      <form className="w-full max-w-md pb-10" onSubmit={onSubmitNewMessage}>
        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">이름 (생략가능)</label>
          <input type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            name="name" value={inputName} onChange={(event) => setInputName(() => event.target.value)}></input>
        </div>
        <div className="mb-5">
          <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">내용</label>
          <textarea id="message" name="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900
                 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="내용 입력" value={inputText} onChange={(event) => setInputText(() => event.target.value)}>
          </textarea>
        </div>

        <button type="submit" disabled={inputText === ""} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:opacity-25">
          보내기
        </button>
      </form>
    </div>
  )
}
