


type Option = {
  image?: string
  text?: string
  type: 'image' | 'text'
}

type Frame = {
  title: string;
  options: Option[]
}

type WizardProps = {
  frames: Frame[]
}

const Wizard = ({ frames }: WizardProps) => {
  console.log('frames', frames)

  return (
    <div className='w-full rounded-xl shadow-xl p-8 flex flex-col items-center'>
      

    </div>
  )
}

export default Wizard
