'use client'

import { Search, BookOpen, MessageCircle, Video, ChevronRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PageLayout } from '@/components/crm/page-layout'

const categories = [
  { icon: <BookOpen className="w-5 h-5" />, title: 'Getting Started', articles: 12, color: 'text-blue-500 bg-blue-500/10' },
  { icon: <MessageCircle className="w-5 h-5" />, title: 'Leads & Contacts', articles: 18, color: 'text-green-500 bg-green-500/10' },
  { icon: <Video className="w-5 h-5" />, title: 'Deals & Pipeline', articles: 9, color: 'text-purple-500 bg-purple-500/10' },
  { icon: <BookOpen className="w-5 h-5" />, title: 'Automation', articles: 7, color: 'text-orange-500 bg-orange-500/10' },
]

const faqs = [
  { q: 'How do I import leads from a CSV file?', a: 'Go to the Leads page, click Import, and upload your CSV file. Our system will automatically map the columns to the correct fields. You can also download a template CSV to see the expected format.' },
  { q: 'Can I customize the pipeline stages?', a: 'Yes! Navigate to Settings > Pipeline to add, remove, or rename stages. You can also set probability percentages for each stage which will be used in revenue forecasting.' },
  { q: 'How does lead scoring work?', a: 'Lead scores are calculated based on engagement signals like email opens, website visits, and form submissions. You can also manually adjust scores and set up automation rules to update scores based on specific actions.' },
  { q: 'How do I set up email integration?', a: 'Go to Settings > Integrations and connect your email provider (Gmail or Outlook). Once connected, all your CRM emails will be logged automatically against the relevant contacts and deals.' },
  { q: 'Can I assign leads to other team members?', a: 'Yes. From any lead or contact record, click the Assignee field to select a team member. You can also set up automation rules for automatic round-robin assignment.' },
]

export default function HelpPage() {
  return (
    <PageLayout title="Help Center" subtitle="Find answers and learn how to use the CRM">
      {/* Search */}
      <div className="max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search help articles..." className="pl-11 h-12 text-base bg-muted" />
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map(cat => (
          <Card key={cat.title} className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="pt-5">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${cat.color}`}>{cat.icon}</div>
              <p className="font-semibold text-sm">{cat.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{cat.articles} articles</p>
              <div className="flex items-center text-xs text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                View articles <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader><CardTitle className="text-base">Frequently Asked Questions</CardTitle></CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">Still need help?</h3>
              <p className="text-sm text-muted-foreground mt-1">Our support team is available Mon–Fri, 9am–6pm EST</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" className="gap-2"><MessageCircle className="w-4 h-4" /> Live Chat</Button>
              <Button size="sm" className="gap-2"><ExternalLink className="w-4 h-4" /> Submit Ticket</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
