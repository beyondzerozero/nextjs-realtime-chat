type Props = {
  timestamp: string;
};

export default function DateFormatter({ timestamp }: Props) {
  const date = new Date(timestamp);
  var jstDate = date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  return <>{jstDate}</>;
}
