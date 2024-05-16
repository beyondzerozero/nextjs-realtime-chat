import ThreadLink from '@/components/threadLink'

export default async function Index() {

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <h1 className="text-3xl font-bold pt-6 pb-10">실시간 채팅방</h1>
      <ul>
        <ThreadLink channelName='thread1' roomName='채팅방1'></ThreadLink>
        <ThreadLink channelName='thread2' roomName='채팅방2'></ThreadLink>
        <ThreadLink channelName='thread3' roomName='채팅방3'></ThreadLink>
        <ThreadLink channelName='thread4' roomName='채팅방4'></ThreadLink>
        <ThreadLink channelName='thread5' roomName='채팅방5'></ThreadLink>
      </ul>
    </div>
  )
}