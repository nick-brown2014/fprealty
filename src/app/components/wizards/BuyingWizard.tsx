'use client'

import { useEffect, useState } from "react"
import { BuyingWizardOptions, WizardOption } from "@/app/types/WizardTypes"
import NextArrow from '@/app/components/wizards/NextArrow'
import PrevArrow from '@/app/components/wizards/PrevArrow'

const defaultBuyingWizard: BuyingWizardOptions = {
  timeframe: '',
  budget: '',
  preApproval: ''
}

const timeframes: WizardOption[] = [
  { label: '1 - 3 months', value: '1-3' },
  { label: '3 - 6 months', value: '3-6' },
  { label: '6 - 12 months', value: '6-12' },
  { label: '12+ months', value: '12+' },
]

const budgets: WizardOption[] = [
  { label: '350k to 500k', value: '350-500' },
  { label: '500k to 750k', value: '500-750' },
  { label: '750k to 1mil', value: '750-1mil' },
  { label: '1mil to 1.5mil', value: '1mil-1.5mil' },
  { label: '1.5mil to 2mil', value: '1.5mil-2mil' },
  { label: 'Over 2mil', value: '2mil+' },
]

const preApprovals: WizardOption[] = [
  { label: 'Yes!', value: 'yes' },
  { label: 'No, but I’m working with a lender licensed in Colorado', value: 'no with lender' },
  { label: 'No, please refer me to a lender we trust', value: 'no without lender' },
  { label: 'Cash buyer', value: 'cash' },
]


const BuyingWizard = () => {
  const [buyingWizardForm, setBuyingWizardForm] = useState<BuyingWizardOptions>(defaultBuyingWizard)
  const [frameNum, setFrameNum] = useState<number>(0)
  
  useEffect(() => {
    if (!!buyingWizardForm.budget && !!buyingWizardForm.preApproval && !!buyingWizardForm.timeframe) {
      setFrameNum(3)
    }
  }, [buyingWizardForm])

  const handleChangeFrame = (newFrame: number) => {
    if (newFrame === frameNum) return
    setFrameNum(newFrame)
  }

  const handleResetForm = () => {
    setBuyingWizardForm(defaultBuyingWizard)
    setFrameNum(0)
  }

  const handleSubmit = () => {
    window.open('https://m.nocorealtor.com/book-with-me-page-4826')
  }

  const updateTimeframe = (newTimeframe: string) => {
    const newWizardForm: BuyingWizardOptions = {...buyingWizardForm, timeframe: newTimeframe}
    setBuyingWizardForm(newWizardForm)
  }

  const updateBudget = (newBudget: string) => {
    const newWizardForm: BuyingWizardOptions = {...buyingWizardForm, budget: newBudget}
    setBuyingWizardForm(newWizardForm)
  }

  const updateApproval = (newApproval: string) => {
    const newWizardForm: BuyingWizardOptions = {...buyingWizardForm, preApproval: newApproval}
    setBuyingWizardForm(newWizardForm)
  }

  const renderTimeframes = () => (
    <div className='w-full flex flex-col gap-12 items-center'>
      <h1 className='font-semibold tracking-tight text-3xl lg:text-5xl'>What is your time frame?</h1>
      <div className='w-full flex flex-col lg:flex-row gap-12 items-center flex-wrap justify-center relative px-12'>
        <NextArrow handleClick={() => setFrameNum(1)} />
        {timeframes.map(option => {
          const isSelected = option.value === buyingWizardForm.timeframe
          return (
            <div
              key={option.value}
              className={`transition duration-500 w-[250px] h-[250px] border-2 border-black items-center justify-center rounded-xl flex flex-col gap-4 ${isSelected ? 'cursor-default text-white bg-black' : 'cursor-pointer hover:opacity-50'}`}
              onClick={() => updateTimeframe(option.value)}
            >
              <img src={`${isSelected ? '/timeframe-white.png' : '/timeframe.png'}`} height={50} width={50} />
              <p className='font-bold tracking-tight text-xl'>{option.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderBudgets = () => (
    <div className='w-full flex flex-col gap-12 items-center'>
      <h1 className='font-semibold tracking-tight text-3xl lg:text-5xl'>What is your budget?</h1>
      <div className='w-full flex flex-col lg:flex-row gap-12 items-center flex-wrap justify-center relative'>
        <NextArrow handleClick={() => setFrameNum(2)} />
        <PrevArrow handleClick={() => setFrameNum(0)} />
        {budgets.map(option => {
          const isSelected = option.value === buyingWizardForm.budget
          return (
            <div
              key={option.value}
              className={`transition duration-500 w-[200px] h-[200px] border-2 border-black items-center justify-center rounded-xl flex flex-col gap-4 ${isSelected ? 'cursor-default text-white bg-black' : 'cursor-pointer hover:opacity-50'}`}
              onClick={() => updateBudget(option.value)}
            >
              <img src={`${isSelected ? '/budget-white.png' : '/budget.png'}`} height={50} width={50} />
              <p className='font-bold tracking-tight text-xl'>{option.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderPreapprovals = () => (
    <div className='w-full flex flex-col gap-12 items-center'>
      <h1 className='font-semibold text-center tracking-tight text-2xl lg:text-4xl'>Do you have a pre-approval letter?</h1>
      <div className='w-full flex flex-col lg:flex-row gap-12 items-center flex-wrap justify-center relative px-12'>
        <PrevArrow handleClick={() => setFrameNum(1)} />
        {preApprovals.map(option => {
          const isSelected = option.value === buyingWizardForm.preApproval
          return (
            <div
              key={option.value}
              className={`transition duration-500 w-[300px] h-[100px] border-2 border-black items-center justify-center rounded-xl flex flex-col gap-4 ${isSelected ? 'cursor-default text-white bg-black' : 'cursor-pointer hover:opacity-50'}`}
              onClick={() => updateApproval(option.value)}
            >
              <p className='font-bold tracking-tight text-xl text-center px-4'>{option.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderContact = () => (
    <div className='w-full flex flex-col justify-center items-center'>
      <h1 className='font-semibold tracking-tight text-3xl lg:text-5xl'>Thank you!</h1>
      <h2 className='font-semibold tracking-tight text-2xl lg:text-3xl mt-8'>Next step: Book a meeting with us</h2>
      <div className='justify-center my-12 gap-8 flex'>
        <p
          className='cursor-pointer py-[4px] px-8 lg:px-12 text-2xl lg:text-3xl font-bold bg-linear-to-r from-primary to-5% to-primary from-5% to-white text-black shadow-xl hover:text-white hover:to-primary transition duration-500'
          onClick={handleSubmit}
        >
          Book a meeting
        </p>
        <p
          className='cursor-pointer py-[4px] px-8 lg:px-12 text-2xl lg:text-3xl font-bold bg-linear-to-r from-primary to-5% to-primary from-5% to-white text-black shadow-xl hover:text-white hover:to-primary transition duration-500'
          onClick={handleResetForm}
        >
          Start over
        </p>
      </div>
    </div>
  )

  if (frameNum === 3) return renderContact()
  return (
    <div className='w-full shadow-2xl p-4 lg:p-8 flex flex-col items-center min-h-96 w-[90vw] lg:w-[1000px] bg-white'>
      <div className='flex items-center justify-center w-full mb-8'>
        <p onClick={() => handleChangeFrame(0)} className={`mr-1 font-semibold tracking-tight ${frameNum === 0 ? 'text-primary cursor-default' : 'cursor-pointer'}`}>TIMEFRAME</p>
        {buyingWizardForm.timeframe && <img src='/check-primary.png' height={12} width={12} />}
        <p onClick={() => handleChangeFrame(1)} className={`ml-2 mr-1 lg:ml-6 font-semibold tracking-tight ${frameNum === 1 ? 'text-primary cursor-default' : 'cursor-pointer'}`}>BUDGET</p>
        {buyingWizardForm.budget && <img src='/check-primary.png' height={12} width={12} />}
        <p onClick={() => handleChangeFrame(2)} className={`ml-2 mr-1 lg:ml-6 font-semibold tracking-tight ${frameNum === 2 ? 'text-primary cursor-default' : 'cursor-pointer'}`}>PRE-APPROVAL</p>
        {buyingWizardForm.preApproval && <img src='/check-primary.png' height={12} width={12} />}
      </div>
      { frameNum === 0 && renderTimeframes() }
      { frameNum === 1 && renderBudgets() }
      { frameNum === 2 && renderPreapprovals() }
    </div>
  )
}

export default BuyingWizard
