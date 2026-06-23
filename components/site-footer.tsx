import Image from "next/image"
import Link from "next/link"
import { AtSign, Facebook, Instagram, Mail, Podcast } from "lucide-react"

const footerLinks = [
  { href: "/#about", label: "關於我們" },
  { href: "https://www.familyfinhealth.com/policies?tab=termsOfUse", label: "服務條款" },
  { href: "https://www.familyfinhealth.com/policies?tab=privacyPolicy", label: "隱私政策" },
  { href: "https://www.familyfinhealth.com/policies?tab=cookiePolicy", label: "Cookie 政策" },
]

const socialLinks = [
  {
    href: "https://www.facebook.com/profile.php?id=61572528928425&locale=zh_TW",
    label: "Facebook",
    icon: Facebook,
  },
  {
    href: "https://www.threads.com/@fhcs2025",
    label: "Threads",
    icon: AtSign,
  },
  {
    href: "https://www.instagram.com/fhcs2025/",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://open.firstory.me/user/haolijiazaipodcast/platforms",
    label: "Podcast",
    icon: Podcast,
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-card/70 px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.75fr)] md:items-start">
        <div>
          <Link href="/" className="inline-flex items-center">
            <Image src="/logo.png" alt="好理家在 財務健檢網" width={180} height={52} className="h-10 w-auto" />
          </Link>
          <nav aria-label="頁尾連結" className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {footerLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-4 md:text-right">
          <div className="flex items-center gap-2 md:justify-end">
            {socialLinks.map((link) => {
              const Icon = link.icon

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-background/80 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  aria-label={`${link.label}（另開新視窗）`}
                  title={`${link.label}（另開新視窗）`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>

          <a
            href="mailto:service@familyfinhealth.com"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            service@familyfinhealth.com
          </a>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-6xl flex-col gap-2 border-t border-border/70 pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 好理家在 財務健檢網</p>
        <p>讓財務整理更容易，也更有人陪。</p>
      </div>
    </footer>
  )
}
