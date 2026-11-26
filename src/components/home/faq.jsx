import { Plus } from 'lucide-react'

const faqs = [
  {
    q: 'Do I pay anything to view a house?',
    a: 'A viewing costs GH₵70 per person. If you choose the home, you also pay the rent advance, any listed security deposit, the monthly utility/service fee, and FieDirect’s 10% fee on agreements under six months, or 7% from six months onward. The full breakdown is shown before you book or pay.',
  },
  {
    q: 'Why can’t I see the landlord’s number?',
    a: 'Because we are the agent. We handle the landlord so you don’t get pressured into side deals or asked for “commitment fees”. If anything goes wrong, you call one number: ours.',
  },
  {
    q: 'I’m a foreigner. Will landlords accept me?',
    a: 'We ask every landlord directly and print the answer on the listing. Filter for “Foreigners welcome” and you will only see places where the answer was yes.',
  },
  {
    q: 'How do I know the house is still available?',
    a: 'We recheck with the landlord at least every 72 hours. The date of the last check is on every listing. Reserved and rented places are clearly marked.',
  },
  {
    q: 'How can I pay?',
    a: 'MTN MoMo, Telecel Cash, AT Money, Visa/Mastercard or bank transfer. You get a receipt with a FieDirect reference for every payment.',
  },
  {
    q: 'Can a landlord list their property?',
    a: 'Not on the app yet. Landlords can WhatsApp us and our team will come and visit. We only list what we have seen ourselves.',
  },
]

export function Faq() {
  return (
    <section
      id="faq"
      className="page-wrap scroll-mt-20 py-8 md:py-10"
    >
      <div className="grid gap-6 border-t pt-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">

        {/* Section heading */}
        <div className="flex flex-col gap-2">
          <p className="eyebrow">Questions</p>

          <h2 className="text-3xl font-bold text-balance sm:text-4xl">
            What people actually ask us.
          </h2>
        </div>

        {/* Frequently asked questions */}
        <div className="flex flex-col">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="faq-item group border-b first:border-t"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-4 text-base font-semibold transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring sm:text-lg [&::-webkit-details-marker]:hidden">
                {q}

                <Plus
                  className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>

              <div className="faq-answer">
                <div className="faq-answer-inner">
                  <p className="max-w-2xl pb-4 leading-relaxed text-muted-foreground">
                    {a}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}