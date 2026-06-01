'use client'

import { useState } from 'react'
import { Save, User, Bell, Shield, Palette, Globe, Key, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { PageLayout } from '@/components/crm/page-layout'

const notificationSettings = [
  { label: 'New Lead Assigned', desc: 'When a lead is assigned to you', key: 'newLead', value: true },
  { label: 'Deal Stage Changed', desc: 'When a deal moves to a new stage', key: 'dealStage', value: true },
  { label: 'Task Due Reminder', desc: 'Remind me 30 mins before due time', key: 'taskDue', value: true },
  { label: 'Email Reply', desc: 'When a contact replies to your email', key: 'emailReply', value: false },
  { label: 'Weekly Report', desc: 'Send weekly performance summary', key: 'weeklyReport', value: true },
  { label: 'Team Mentions', desc: 'When someone @mentions you', key: 'mentions', value: false },
]

export default function SettingsPage() {
  const [notifs, setNotifs] = useState(
    notificationSettings.reduce((acc, n) => ({ ...acc, [n.key]: n.value }), {} as Record<string, boolean>)
  )

  return (
    <PageLayout
      title="Settings"
      subtitle="Manage your account and preferences"
    >
      <Tabs defaultValue="profile" orientation="vertical">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="md:w-48 shrink-0">
            <TabsList className="flex md:flex-col h-auto gap-1 bg-transparent p-0 justify-start">
              {[
                { value: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
                { value: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
                { value: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
                { value: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
                { value: 'integrations', label: 'Integrations', icon: <Globe className="w-4 h-4" /> },
                { value: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
              ].map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="justify-start gap-2 px-3 py-2.5 text-sm data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-lg w-full"
                >
                  {tab.icon} {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-w-0">
            <TabsContent value="profile" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src="https://avatar.vercel.sh/user" />
                      <AvatarFallback className="text-xl">JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">Change Photo</Button>
                      <p className="text-xs text-muted-foreground mt-1">JPG, GIF or PNG. Max 1MB.</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input defaultValue="Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input defaultValue="john@company.com" type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input defaultValue="+1 (555) 000-0000" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Job Title</Label>
                      <Input defaultValue="Sales Manager" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="gap-2"><Save className="w-4 h-4" /> Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what alerts you receive</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notificationSettings.map(n => (
                      <div key={n.key} className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-0">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{n.label}</p>
                          <p className="text-xs text-muted-foreground">{n.desc}</p>
                        </div>
                        <Switch
                          checked={notifs[n.key]}
                          onCheckedChange={v => setNotifs(prev => ({ ...prev, [n.key]: v }))}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button className="gap-2"><Save className="w-4 h-4" /> Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and 2FA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Change Password</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Current Password</Label>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label>Confirm New Password</Label>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                    </div>
                    <Button variant="outline" className="gap-2"><Key className="w-4 h-4" /> Update Password</Button>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground mb-3">Add an extra layer of security to your account</p>
                    <div className="flex items-center justify-between border border-border rounded-lg p-4">
                      <div>
                        <p className="text-sm font-medium">Authenticator App</p>
                        <p className="text-xs text-muted-foreground">Use Google Authenticator or similar</p>
                      </div>
                      <Button size="sm" variant="outline">Enable</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look of your CRM</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-3 block">Theme</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Light', 'Dark', 'System'].map(theme => (
                          <button key={theme} className={`p-4 rounded-lg border-2 text-sm font-medium transition-colors ${theme === 'Dark' ? 'border-primary' : 'border-border hover:border-muted-foreground'}`}>
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label className="mb-3 block">Accent Color</Label>
                      <div className="flex gap-3">
                        {['#4F46E5', '#06B6D4', '#10B981', '#EC4899', '#F59E0B'].map(color => (
                          <button key={color} className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-offset-background hover:ring-primary transition-all" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>Connect your tools and services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Google Workspace', desc: 'Sync emails and calendar', connected: true },
                      { name: 'Slack', desc: 'Team notifications', connected: true },
                      { name: 'HubSpot', desc: 'Import contacts and deals', connected: false },
                      { name: 'Salesforce', desc: 'Bidirectional sync', connected: false },
                      { name: 'Zapier', desc: 'Connect 5000+ apps', connected: false },
                    ].map(int => (
                      <div key={int.name} className="flex items-center justify-between border border-border rounded-lg p-4">
                        <div>
                          <p className="text-sm font-medium">{int.name}</p>
                          <p className="text-xs text-muted-foreground">{int.desc}</p>
                        </div>
                        <Button size="sm" variant={int.connected ? 'destructive' : 'outline'} className="shrink-0">
                          {int.connected ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Plan</CardTitle>
                  <CardDescription>Manage your subscription</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">Pro Plan</p>
                        <p className="text-sm text-muted-foreground">$49/month · Renews Mar 11, 2027</p>
                      </div>
                      <Button variant="outline" size="sm">Upgrade to Enterprise</Button>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Payment Method</h3>
                    <div className="flex items-center justify-between border border-border rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Visa ending in 4242</p>
                          <p className="text-xs text-muted-foreground">Expires 12/2028</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Update</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </PageLayout>
  )
}
