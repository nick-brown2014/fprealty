
type Props = {
  disabled?: boolean
  handleClick: () => void
}

const PrevArrow = ({disabled, handleClick}: Props) => (
  <div
    onClick={handleClick}
    className={`absolute rounded-full left-[-15px] bg-white z-10 border-2 border-black w-12 h-12 flex items-center justify-center ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:opacity-50'}`}
  >
    <img src='/chevron-left.png' height={16} width={16} />
  </div>
)

export default PrevArrow