import Link from 'next/link'

type Props = {
  channelName: string,
  roomName: string,
}

export default function threadLink({ channelName, roomName }: Props) {
  return (
    <li className='mb-4'>
      <Link className='text-gray-700 border-b-2 border-gray-700 hover:border-blue-700 hover:text-blue-700 text-xl' href={{
        pathname: '/chats',
        query: { channel_name: channelName },
      }}>{roomName}</Link>
    </li>
  )
}
