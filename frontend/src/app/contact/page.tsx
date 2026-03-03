import Image from "next/image";
import { Badge, Button, MaterialIcon } from "@/components/ui";

export default function ContactPage() {
  return (
    <div className="w-full max-w-[1024px] flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="relative mt-6 md:mt-10 overflow-hidden rounded-[2.5rem] bg-white px-8 py-12 md:py-16 md:px-14">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gray-100/80 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-gray-100/80 blur-3xl" />

        <div className="relative flex flex-col-reverse gap-10 md:flex-row md:items-center">
          {/* Text */}
          <div className="flex flex-1 flex-col items-start gap-6 md:pr-8">
            <div className="flex flex-col gap-4 text-left">
              <Badge className="w-fit border border-amber-200 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
                <MaterialIcon name="mail" className="text-sm" />
                Get in Touch
              </Badge>

              <h1 className="font-serif-display text-5xl font-black leading-[1.1] tracking-tight text-text-main md:text-6xl">
                Have a Sweet <span className="gradient-text">Question?</span>
              </h1>

              <p className="max-w-[480px] text-lg font-medium leading-relaxed text-text-muted">
                Whether you have a recipe idea, a question about Mr. A's latest book, or just want to say hi, we're all ears! Our team is ready to scoop up your thoughts.
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="group relative w-full flex-1">
            {/* Glow aura */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-[#FFB347]/30 via-primary/15 to-[#ff8fa3]/30 opacity-70 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />

            <div className="relative w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/15 transition-transform duration-500 hover:-translate-y-2">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxSPECTsBCgrNJB23K4GjyEIeMHCRYqqcRdyPNshxYpHO9wpMg5wDP83oW5bgyWrrvxH4Pcho0XEbYs7QI9C4P-KHKGIkgwQ2oBXwpJQPbdc1B9RrJyOZDzHJFESzcQxEAASCJ_pnQdxegEPxUM0pOKtqvc2Za_6JRlKefomyj2LQkognIOAznl7sQfQq_q7lsJr7rz-NgHqkzxr1b__f-ySyTjyK4cSKttvp0szGjBUzKRAqNSVQT7dvksBlN7lJ2Q98Z1RHiat4"
                alt="Ice Cream Scoops"
                width={600}
                height={450}
                className="aspect-square w-full object-cover md:aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Form Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-white px-8 py-12 md:py-16 md:px-14">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">
            <div className="mb-10">
              <h2 className="font-serif-display text-3xl font-black text-text-main md:text-4xl mb-3">
                Send us a <span className="gradient-text">Message</span>
              </h2>
              <p className="text-text-muted dark:text-gray-400 text-base">
                Fill out the form below and we'll get back to you faster than ice cream melts.
              </p>
            </div>

            <form className="flex flex-col gap-6">
              {/* Name & Email Row */}
              <div className="flex flex-col md:flex-row gap-6">
                <label className="flex flex-col flex-1 gap-2">
                  <span className="text-sm font-bold text-text-main dark:text-gray-200">Name</span>
                  <input
                    className="w-full h-12 px-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-main dark:text-white placeholder:text-text-muted/60 transition-all"
                    placeholder="Your Name"
                    type="text"
                  />
                </label>

                <label className="flex flex-col flex-1 gap-2">
                  <span className="text-sm font-bold text-text-main dark:text-gray-200">Email</span>
                  <input
                    className="w-full h-12 px-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-main dark:text-white placeholder:text-text-muted/60 transition-all"
                    placeholder="your@email.com"
                    type="email"
                  />
                </label>
              </div>

              {/* Topic Select */}
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-text-main dark:text-gray-200">Topic</span>
                <div className="relative">
                  <select className="w-full h-12 px-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-main dark:text-white appearance-none cursor-pointer transition-all">
                    <option value="" disabled defaultValue="">
                      Select a topic...
                    </option>
                    <option value="general">General Scoop</option>
                    <option value="recipe">Submit a Recipe</option>
                    <option value="book">Book Inquiry</option>
                    <option value="franchise">Franchise Opportunities</option>
                  </select>
                  <MaterialIcon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </label>

              {/* Message Textarea */}
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-text-main dark:text-gray-200">Message</span>
                <textarea
                  className="w-full p-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-main dark:text-white placeholder:text-text-muted/60 resize-none transition-all"
                  placeholder="Tell us what's on your mind..."
                  rows={5}
                />
              </label>

              {/* Submit Button */}
              <Button className="mt-2 h-12 flex-1 shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40">
                <span>Send Message</span>
                <MaterialIcon name="send" className="text-sm" />
              </Button>
            </form>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-primary/5 to-white p-8 md:p-16">
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-rose-200/20 blur-3xl" />

          <div className="relative space-y-8">
            <div>
              <h2 className="font-serif-display text-3xl font-black text-text-main md:text-4xl mb-6 flex items-center gap-3">
                <div className="rounded-full bg-primary/20 p-2">
                  <MaterialIcon name="storefront" className="text-primary" />
                </div>
                Visit Our Parlor
              </h2>
            </div>

            {/* Contact Info Items */}
            {[
              {
                icon: "location_on",
                title: "Headquarters",
                content: (
                  <>
                    123 Scoop Street,<br />
                    Creamery District, NY 10012
                  </>
                ),
              },
              {
                icon: "call",
                title: "Phone",
                content: (
                  <>
                    (555) SCOOPS-4U<br />
                    <span className="text-xs text-text-muted">Mon-Sun, 10am - 9pm</span>
                  </>
                ),
              },
              {
                icon: "mail",
                title: "Email",
                content: (
                  <a
                    className="font-semibold text-primary hover:text-primary-dark transition-colors"
                    href="mailto:hello@mrasicecream.com"
                  >
                    hello@mrasicecream.com
                  </a>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform border border-white/50">
                  <MaterialIcon name={item.icon} className="text-xl" />
                </div>
                <div>
                  <p className="font-bold text-text-main dark:text-white text-sm">
                    {item.title}
                  </p>
                  <p className="text-text-muted dark:text-gray-400 text-sm mt-1 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Map Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] h-96 md:h-[500px] group shadow-xl">
        <Image
          alt="Map Location"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM6c1xoQANWXMixAmPrPs5hnObmb7rOZflkq9t0P5ftnkrlYlzYz4zebXGRM_Py-994-lOCa_-QlKO9xIDnnOojMQHZh5qVHpRteZ36LLANIWRGK2Lcgedvzq8n-ciqlCZ2htmIjiTjVen9U5PChIpUgtu3-86Mvews2Gsq0DP5j4DVIfHkYrVl8h2ffAPx-VKlvfckiX-SFZj2SgcwZ4DR6KThnv5g2xfmPJ9X7of4pls4FuubXpvPpefDuYtvuLV2Ts0506pSOY"
          alt="Map Location"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 md:p-8">
          <Button className="text-base gap-2 shadow-lg">
            <MaterialIcon name="directions" className="text-lg" />
            Get Directions
          </Button>
        </div>
      </section>
    </div>
  );
}