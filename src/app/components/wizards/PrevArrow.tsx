
type Props = {
  disabled?: boolean
  customClasses?: string
  handleClick: () => void
}

const PrevArrow = ({disabled, handleClick, customClasses}: Props) => (
  <div
    onClick={handleClick}
    className={`absolute hidden rounded-full left-0 bg-white z-10 border-2 border-black w-12 h-12 md:flex items-center justify-center ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:opacity-50'} ${customClasses}`}
  >
    <img src='/chevron-left.png' className='h-8 w-8 mr-[4px]' />
  </div>
)

export default PrevArrow