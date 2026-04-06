'use client'

import { useState, useMemo } from 'react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)

const formatCurrencyWhole = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

type AmortizationRow = {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
  totalInterest: number
}

const MortgageCalculatorPage = () => {
  const [homeValue, setHomeValue] = useState(300000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [downPaymentAmount, setDownPaymentAmount] = useState(60000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [propertyTax, setPropertyTax] = useState(3600)
  const [homeInsurance, setHomeInsurance] = useState(1200)
  const [pmi, setPmi] = useState(0.5)
  const [monthlyHoa, setMonthlyHoa] = useState(0)
  const [showAmortization, setShowAmortization] = useState(false)

  const loanAmount = homeValue - downPaymentAmount

  const handleHomeValueChange = (val: number) => {
    setHomeValue(val)
    setDownPaymentAmount(Math.round(val * (downPaymentPercent / 100)))
  }

  const handleDownPaymentPercentChange = (val: number) => {
    setDownPaymentPercent(val)
    setDownPaymentAmount(Math.round(homeValue * (val / 100)))
  }

  const handleDownPaymentAmountChange = (val: number) => {
    setDownPaymentAmount(val)
    if (homeValue > 0) {
      setDownPaymentPercent(parseFloat(((val / homeValue) * 100).toFixed(2)))
    }
  }

  const calculation = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12
    const numPayments = loanTerm * 12
    const principal = loanAmount

    let monthlyPrincipalInterest = 0
    if (monthlyRate > 0 && numPayments > 0 && principal > 0) {
      monthlyPrincipalInterest =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
    } else if (numPayments > 0 && principal > 0) {
      monthlyPrincipalInterest = principal / numPayments
    }

    const monthlyPropertyTax = propertyTax / 12
    const monthlyInsurance = homeInsurance / 12
    const monthlyPmi = downPaymentPercent < 20 ? (principal * (pmi / 100)) / 12 : 0
    const totalMonthly =
      monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance + monthlyPmi + monthlyHoa
    const totalInterest = monthlyPrincipalInterest * numPayments - principal
    const totalCost = monthlyPrincipalInterest * numPayments + (monthlyPropertyTax + monthlyInsurance + monthlyPmi + monthlyHoa) * numPayments

    // Amortization schedule
    const schedule: AmortizationRow[] = []
    let balance = principal
    let cumulativeInterest = 0
    for (let i = 1; i <= numPayments; i++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = monthlyPrincipalInterest - interestPayment
      balance -= principalPayment
      cumulativeInterest += interestPayment
      schedule.push({
        month: i,
        payment: monthlyPrincipalInterest,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
        totalInterest: cumulativeInterest,
      })
    }

    return {
      monthlyPrincipalInterest,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyPmi,
      totalMonthly,
      totalInterest,
      totalCost,
      schedule,
    }
  }, [loanAmount, interestRate, loanTerm, propertyTax, homeInsurance, pmi, monthlyHoa, downPaymentPercent])

  // Pie chart data
  const pieData = [
    { label: 'Principal & Interest', value: calculation.monthlyPrincipalInterest, color: '#C20E10' },
    { label: 'Property Tax', value: calculation.monthlyPropertyTax, color: '#607D8B' },
    { label: 'Home Insurance', value: calculation.monthlyInsurance, color: '#2196F3' },
    ...(calculation.monthlyPmi > 0
      ? [{ label: 'PMI', value: calculation.monthlyPmi, color: '#FF9800' }]
      : []),
    ...(monthlyHoa > 0
      ? [{ label: 'HOA', value: monthlyHoa, color: '#4CAF50' }]
      : []),
  ]

  const totalForPie = pieData.reduce((sum, d) => sum + d.value, 0)

  const renderPieChart = () => {
    let cumulativePercent = 0
    const size = 200
    const center = size / 2
    const radius = 80

    const getCoordinatesForPercent = (percent: number) => {
      const x = Math.cos(2 * Math.PI * percent)
      const y = Math.sin(2 * Math.PI * percent)
      return [center + x * radius, center + y * radius]
    }

    return (
      <svg viewBox={`0 0 ${size} ${size}`} className='w-48 h-48 md:w-56 md:h-56 mx-auto'>
        {pieData.map((slice) => {
          if (totalForPie === 0) return null
          const slicePercent = slice.value / totalForPie
          const startPercent = cumulativePercent
          cumulativePercent += slicePercent

          const [startX, startY] = getCoordinatesForPercent(startPercent)
          const [endX, endY] = getCoordinatesForPercent(cumulativePercent)
          const largeArcFlag = slicePercent > 0.5 ? 1 : 0

          const pathData = [
            `M ${center} ${center}`,
            `L ${startX} ${startY}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            `Z`,
          ].join(' ')

          return <path key={slice.label} d={pathData} fill={slice.color} />
        })}
      </svg>
    )
  }

  return (
    <div className='w-full h-full flex-col'>
      <Nav />
      <div className='pb-10 items-center flex-col flex'>
        {/* Hero Section */}
        <div className='items-center w-full flex-col bg-gray-900 min-h-48 lg:min-h-[280px] justify-center flex pt-24 pb-12'>
          <h1 className='font-bold text-center tracking-tight text-3xl sm:text-5xl lg:text-7xl text-white'>
            Mortgage Calculator
          </h1>
          <h2 className='mt-4 font-bold tracking-tight text-lg lg:text-2xl text-gray-300 text-center px-4'>
            Estimate your monthly mortgage payment
          </h2>
        </div>

        <div className='max-w-7xl w-full mt-10 px-4 lg:px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Left Column: Inputs */}
            <div className='lg:col-span-2 space-y-6'>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>Loan Details</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Home Value */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-1'>Home Price</label>
                    <div className='relative'>
                      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>$</span>
                      <input
                        type='number'
                        value={homeValue}
                        onChange={(e) => handleHomeValueChange(Number(e.target.value))}
                        className='w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none'
                      />
                    </div>
                  </div>

                  {/* Down Payment */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-1'>Down Payment</label>
                    <div className='flex gap-2'>
                      <div className='relative flex-1'>
                        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>$</span>
                        <input
                          type='number'
                          value={downPaymentAmount}
                          onChange={(e) => handleDownPaymentAmountChange(Number(e.target.value))}
                          className='w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none'
                        />
                      </div>
                      <div className='relative w-24'>
                        <input
                          type='number'
                          value={downPaymentPercent}
                          onChange={(e) => handleDownPaymentPercentChange(Number(e.target.value))}
                          className='w-full pl-3 pr-9 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none'
                        />
                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'>%</span>
                      </div>
                    </div>
                  </div>

                  {/* Loan Amount (computed) */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-1'>Loan Amount</label>
                    <div className='w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 font-medium'>
                      {formatCurrencyWhole(loanAmount)}
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-1'>Interest Rate</label>
                    <div className='relative'>
                      <input
                        type='number'
                        step='0.125'
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className='w-full pl-3 pr-9 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none'
                      />
                      <span className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'>%</span>
                    </div>
                  </div>

                  {/* Loan Term */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-1'>Loan Term</label>
                    <select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className='w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white'
                    >
                      <option value={30}>30 Years</option>
                      <option value={20}>20 Years</option>
                      <option value={15}>15 Years</option>
                      <option value={10}>10 Years</option>
                    </select>
                  </div>

                  {/* Property Tax */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-1'>Annual Property Tax</label>
                    <div className='relative'>
                      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>$</span>
                      <input
                        type='number'
                        value={propertyTax}
                        onChange={(e) => setPropertyTax(Number(e.target.value))}
                        className='w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none'
                      />
                    </div>
                  </div>

                  {/* Home Insurance */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-1'>Annual Home Insurance</label>
                    <div className='relative'>
                      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>$</span>
                      <input
                        type='number'
                        value={homeInsurance}
                        onChange={(e) => setHomeInsurance(Number(e.target.value))}
                        className='w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none'
                      />
                    </div>
                  </div>

                  {/* PMI */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-1'>
                      PMI
                      {downPaymentPercent >= 20 && (
                        <span className='text-xs font-normal text-green-600 ml-2'>Not required (20%+ down)</span>
                      )}
                    </label>
                    <div className='relative'>
                      <input
                        type='number'
                        step='0.1'
                        value={pmi}
                        onChange={(e) => setPmi(Number(e.target.value))}
                        disabled={downPaymentPercent >= 20}
                        className='w-full pl-3 pr-9 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none disabled:bg-gray-100 disabled:text-gray-400'
                      />
                      <span className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'>%</span>
                    </div>
                  </div>

                  {/* Monthly HOA */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-1'>Monthly HOA</label>
                    <div className='relative'>
                      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>$</span>
                      <input
                        type='number'
                        value={monthlyHoa}
                        onChange={(e) => setMonthlyHoa(Number(e.target.value))}
                        className='w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Results */}
            <div className='space-y-6'>
              {/* Monthly Payment */}
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-2'>Monthly Payment</h2>
                <p className='text-4xl font-bold text-primary mb-4'>
                  {formatCurrency(calculation.totalMonthly)}
                </p>
                <div className='space-y-3'>
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span className='text-gray-600 flex items-center gap-2'>
                      <span className='w-3 h-3 rounded-full inline-block' style={{ backgroundColor: '#C20E10' }}></span>
                      Principal & Interest
                    </span>
                    <span className='font-medium text-gray-900'>
                      {formatCurrency(calculation.monthlyPrincipalInterest)}
                    </span>
                  </div>
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span className='text-gray-600 flex items-center gap-2'>
                      <span className='w-3 h-3 rounded-full inline-block' style={{ backgroundColor: '#607D8B' }}></span>
                      Property Tax
                    </span>
                    <span className='font-medium text-gray-900'>
                      {formatCurrency(calculation.monthlyPropertyTax)}
                    </span>
                  </div>
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span className='text-gray-600 flex items-center gap-2'>
                      <span className='w-3 h-3 rounded-full inline-block' style={{ backgroundColor: '#2196F3' }}></span>
                      Home Insurance
                    </span>
                    <span className='font-medium text-gray-900'>
                      {formatCurrency(calculation.monthlyInsurance)}
                    </span>
                  </div>
                  {calculation.monthlyPmi > 0 && (
                    <div className='flex justify-between py-2 border-b border-gray-200'>
                      <span className='text-gray-600 flex items-center gap-2'>
                        <span className='w-3 h-3 rounded-full inline-block' style={{ backgroundColor: '#FF9800' }}></span>
                        PMI
                      </span>
                      <span className='font-medium text-gray-900'>
                        {formatCurrency(calculation.monthlyPmi)}
                      </span>
                    </div>
                  )}
                  {monthlyHoa > 0 && (
                    <div className='flex justify-between py-2 border-b border-gray-200'>
                      <span className='text-gray-600 flex items-center gap-2'>
                        <span className='w-3 h-3 rounded-full inline-block' style={{ backgroundColor: '#4CAF50' }}></span>
                        HOA
                      </span>
                      <span className='font-medium text-gray-900'>
                        {formatCurrency(monthlyHoa)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pie Chart */}
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>Payment Breakdown</h2>
                {renderPieChart()}
              </div>

              {/* Loan Summary */}
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>Loan Summary</h2>
                <div className='space-y-3'>
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span className='text-gray-600'>Loan Amount</span>
                    <span className='font-medium text-gray-900'>{formatCurrencyWhole(loanAmount)}</span>
                  </div>
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span className='text-gray-600'>Total Interest</span>
                    <span className='font-medium text-gray-900'>{formatCurrencyWhole(calculation.totalInterest)}</span>
                  </div>
                  <div className='flex justify-between py-2 border-b border-gray-200'>
                    <span className='text-gray-600'>Total of All Payments</span>
                    <span className='font-semibold text-gray-900'>{formatCurrencyWhole(calculation.totalCost)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amortization Schedule */}
          <div className='mt-8'>
            <button
              onClick={() => setShowAmortization(!showAmortization)}
              className='cursor-pointer bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow font-semibold text-gray-900 border border-gray-200 flex items-center gap-2'
            >
              <span>{showAmortization ? 'Hide' : 'Show'} Amortization Schedule</span>
              <svg
                className={`w-5 h-5 transition-transform ${showAmortization ? 'rotate-180' : ''}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </button>

            {showAmortization && (
              <div className='bg-white rounded-lg shadow-md mt-4 overflow-hidden'>
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='bg-gray-900 text-white'>
                        <th className='px-4 py-3 text-left font-semibold'>Month</th>
                        <th className='px-4 py-3 text-right font-semibold'>Payment</th>
                        <th className='px-4 py-3 text-right font-semibold'>Principal</th>
                        <th className='px-4 py-3 text-right font-semibold'>Interest</th>
                        <th className='px-4 py-3 text-right font-semibold'>Total Interest</th>
                        <th className='px-4 py-3 text-right font-semibold'>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculation.schedule.map((row) => (
                        <tr
                          key={row.month}
                          className={`border-b border-gray-100 ${
                            row.month % 12 === 0 ? 'bg-red-50 font-semibold' : row.month % 2 === 0 ? 'bg-gray-50' : ''
                          }`}
                        >
                          <td className='px-4 py-2 text-gray-700'>
                            {row.month}
                            {row.month % 12 === 0 && (
                              <span className='ml-2 text-xs text-primary font-bold'>Year {row.month / 12}</span>
                            )}
                          </td>
                          <td className='px-4 py-2 text-right text-gray-900'>{formatCurrency(row.payment)}</td>
                          <td className='px-4 py-2 text-right text-gray-900'>{formatCurrency(row.principal)}</td>
                          <td className='px-4 py-2 text-right text-gray-900'>{formatCurrency(row.interest)}</td>
                          <td className='px-4 py-2 text-right text-gray-900'>{formatCurrency(row.totalInterest)}</td>
                          <td className='px-4 py-2 text-right text-gray-900'>{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MortgageCalculatorPage
