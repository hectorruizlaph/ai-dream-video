function ProgressBar({value}) {
  const width = useSpring(value, {damping: 20})
  return (
    <div className="flex h-6 w-full flex-row items-start justify-start">
      <div
        className="h-full w-full bg-green-500"
        style={{scaleX: width, originX: 0}}
        transition={{ease: "easeIn"}}
      />
    </div>
  )
}
