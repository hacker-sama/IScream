import Image from "next/image";
import { Badge, Button, MaterialIcon } from "@/components/ui";

export default function AboutPage() {
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
                <MaterialIcon name="history" className="text-sm" />
                Our Story
              </Badge>

              <h1 className="font-serif-display text-5xl font-black leading-[1.1] tracking-tight text-text-main md:text-6xl">
                Scooping Happiness Since{" "}
                <span className="gradient-text">1985</span>
              </h1>

              <p className="max-w-[480px] text-lg font-medium leading-relaxed text-text-muted">
                Meet Mr. A, the man behind the flavor, and discover how a single cart and a big dream became a sweet empire loved by thousands.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex w-full flex-wrap gap-4">
              <Button className="h-12 flex-1 px-8 text-base shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40 sm:flex-none">
                Read Full History
              </Button>
              <Button
                variant="outline"
                className="h-12 flex-1 border-primary/30 px-8 text-base hover:border-primary hover:bg-primary/5 sm:flex-none"
              >
                Watch Video
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="group relative w-full flex-1">
            {/* Glow aura */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-[#FFB347]/30 via-primary/15 to-[#ff8fa3]/30 opacity-70 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />

            <div className="relative w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/15 transition-transform duration-500 hover:-translate-y-2">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1LHDEgY0UHJ3WB7i4zAS4n0LYCWM8h6aYA0fIPs6haR_jcQopVJwYqyf7trDRQejzDvffZbCHsjeudFEv-rub3xymgQ3Rio8toJ7sN5rGu-V0v66H3hUHUqdvTDbLLc-JZH136816WJWj6cl97CFEVED-xjuQ6ZfQ9ExrD3Wq-Vtz5FdmqIhQ7_dnaM8aMvrJUraLSMhP_gfiS2j0MuwbJSX721aNn7p6qez6Ojfk36XYFYU6fv4rSyxe1c7RqaZ6wNZsrq6GGXQ"
                alt="Portrait of Mr. A smiling while holding a large ice cream cone"
                width={600}
                height={450}
                className="aspect-square w-full object-cover md:aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Founder Quote Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-primary/5 to-white p-8 md:p-16">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-rose-200/20 blur-3xl" />

        <div className="relative flex flex-col items-center gap-8 text-center">
          <MaterialIcon name="quote" className="text-5xl text-primary/30" />

          <h2 className="font-serif-display max-w-2xl text-3xl font-black leading-[1.3] text-text-main md:text-4xl">
            "I believe that a good scoop of ice cream can turn a bad day around. It's not just milk and sugar; it's a memory in the making."
          </h2>

          <div className="flex items-center gap-4">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCobioVydCugk9scZ2kkPQN1nALSAxrvCphMh893p6nKoBPhc6hbaG38HIfyS2voZfc4itNXuC2Wftwsi0CkjOdlXRX5bbyzA7G_Mfql_IXbZNI0C3SV_N64Is1Kcqtu7xtsKFL6y602CcXubIutqobPhrXJR-OAhAFzUtT9F8MK3EFAdY6JJbkswlrc89eC2oMHDaxZuIP7ffro6zCTx1MZ0NgLH8VC9QYLqTlJOiJ8ozb2q5Uh35rYdXUuADCrw6JUOSO9h0U93o"
              alt="Portrait of Mr. A"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-bold text-text-main">Arthur "Mr. A" Anderson</p>
              <p className="text-sm text-text-muted">Founder & Creator</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline History Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-white px-8 py-12 md:py-16 md:px-14">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <div className="flex flex-col items-center gap-3 mb-12">
            <Badge className="border border-amber-200 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
              <MaterialIcon name="timeline" className="text-sm" />
              Milestones
            </Badge>
            <h2 className="font-serif-display text-4xl font-black text-center text-text-main md:text-5xl">
              Our Sweet <span className="gradient-text">Journey</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                year: "1985",
                title: "The First Cart",
                icon: "shopping_cart",
                description: "Mr. A bought a vintage pushcart and started selling homemade vanilla bean ice cream at the local park. It sold out in 2 hours.",
              },
              {
                year: "1990",
                title: "First Shop Opens",
                icon: "storefront",
                description: "Demand grew too big for the cart. The first brick-and-mortar shop opened on Main Street, introducing 12 signature flavors.",
              },
              {
                year: "2005",
                title: "Recipe Book Published",
                icon: "menu_book",
                description: '"Scoops of Joy" hit the shelves, sharing Mr. A\'s secret techniques with home cooks around the world.',
              },
              {
                year: "2023",
                title: "National Golden Spoon Award",
                icon: "emoji_events",
                description: 'Recognized for "Outstanding Contribution to Dessert Culture" and commitment to sustainable dairy farming.',
              },
            ].map((milestone) => (
              <div
                key={milestone.year}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-lg dark:bg-surface-dark dark:border-surface-dark/50"
              >
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <span className="inline-block text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mb-2">
                        {milestone.year}
                      </span>
                      <h3 className="font-bold text-xl text-text-main dark:text-white">
                        {milestone.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-rose-200/20 flex items-center justify-center text-primary">
                      <MaterialIcon name={milestone.icon} />
                    </div>
                  </div>
                  <p className="text-text-muted dark:text-gray-400">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-16" style={{
        background: "linear-gradient(135deg, #fffbe6 0%, #fff5d6 35%, #fff0f0 70%, #fff9f0 100%)",
      }}>
        {/* Decorative blobs */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute -bottom-20 right-8 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <div className="flex flex-col items-center gap-4 mb-12">
            <Badge className="border border-amber-200 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
              <MaterialIcon name="favorite" className="text-sm" />
              Values
            </Badge>
            <h2 className="font-serif-display text-4xl font-black text-center text-text-main md:text-5xl">
              What Matters <span className="gradient-text">Most</span>
            </h2>
            <p className="max-w-md text-center text-text-muted">
              We take our ice cream seriously, but not ourselves. These are the values that guide every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "eco",
                title: "Farm Fresh",
                color: "from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
                iconColor: "text-green-600 dark:text-green-400",
                description:
                  "We source all our milk from local farms within 50 miles. If it's not fresh, it's not in our freezer.",
              },
              {
                icon: "people",
                title: "Community First",
                color: "from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30",
                iconColor: "text-blue-600 dark:text-blue-400",
                description:
                  "We are more than a shop; we are a gathering place. We support local schools and host weekly events.",
              },
              {
                icon: "sentiment_very_satisfied",
                title: "Pure Joy",
                color: "from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30",
                iconColor: "text-yellow-600 dark:text-yellow-400",
                description:
                  "No artificial preservatives or grumpy faces allowed. Happiness is the most important ingredient.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-8 border border-white/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg dark:bg-surface-dark/80 dark:border-surface-dark/50"
              >
                <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors" />

                <div className="relative">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <MaterialIcon name={value.icon} className={`text-2xl ${value.iconColor}`} />
                  </div>

                  <h3 className="text-xl font-bold text-text-main dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-text-muted dark:text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-white px-8 py-12 md:py-16 md:px-14">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-rose-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-amber-100/60 blur-3xl" />

        <div className="relative">
          <h2 className="font-serif-display text-4xl font-black text-text-main md:text-5xl mb-8">
            Life at the <span className="gradient-text">Parlor</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-96 md:h-[500px]">
            <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZ82ERDWG-oTuUDZHnxpTVbCz7aJmBi5b9uSC_Db6IAkS3726SpqYe8B6PvrIoiNu0kceWaGFWikIaiDuagk3SphnOjtgA0aiGbxiRQwaHna7TDIgo3ekDrvCjrf-pw1J7d9kfHBV8WWTRxqp4DGXzSj98PBCnk_ssx_3dyIcOWCISl-0A-i6hjWsHrsmEeVx2W2c_yVUkMkQeFw7rxC_wd4-FTZI-QMjiU1b4TX3vdstlM-BcsVdJcRrssIHgF7ekQZj5dStzZnM"
                alt="Close up of three scoops of colorful ice cream in a waffle cone"
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>

            <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative group">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjPoNNMteBMAju4CulJVI3AoBynyOzy7Sux8XjKnhtWrBuPkPUc4W8cWVq-7yXgU1qxWS9-oXKOAYZ692uxOkwzssdyRT5LDY-ZW3UQuZ9Tqg8ZAVFcg28k85Z5bQiLHWmjY_C8pRuNoaF3Iv20cCCaFXs4m1gqZnjuXv4KvAaXCuyoATJuKy_dFlpbCCCrqKVgWgrBKcE4KIP-HszegNZGwOQZVJ_N_jcEYOn4NNDJzfVlhrQrx6uOsp1uRCri7t-VaQ-oAKAB7U"
                alt="Interior view of the ice cream shop"
                width={200}
                height={200}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative group">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQEAHi1u1VdHJxZW6SktyCgv6GH-6nffrcVTVo9IHt8BTcpLMoZXU0Umlu49vOB78mrH3HymjvTkSs9alIAQ8QHG0bcH41MI15kXaZtEqzXnWSi3MyEV0Bpfb2YeF3QW1wAxvuQSD6HwNQBO7QcvG5H6nTgCjdO8m9Kj5-7zT7HSpRW7xV0j3Q559ebWH1bKMQk1BHNw7R_iDhwUlg3hI48zZcA0By-Mh0pLo8ZctZXO2YoNSixGWscEV69M33w34l-1qDITkNQWg"
                alt="A child laughing while eating ice cream"
                width={200}
                height={200}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden relative group">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGJTlsFOHoQyBFA3OBp607cxwICXSn-t-GJIKvG4Nv-eFefIsAsxby8cmv_o0x8GY_SCTD6FtlZxr32XdK968tOH0148dk7So5uFO5umyAElWSYcoi6j7uvBB7-YtB9wJ2XTjHdo-zaPCCiHgerAvsrz1MQKQofeNIgvNsnwSKxYYoO2BnF8LjyHaGt2-lumFZ1LU8cjYq9gXMGYzdCEgJzzK4FrPPl6OnHyNsXClEeTU7ujam1fGTkat7HYCZiVoLZvMcQHiITIQ"
                alt="A vintage style sign that says Open for Business"
                width={400}
                height={200}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative mt-10 overflow-hidden rounded-[2.5rem] shadow-xl"
        style={{
          background: "linear-gradient(135deg, #fffbe6 0%, #fff5d6 35%, #fff0f0 70%, #fff9f0 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute -bottom-20 right-8 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/3 top-0 h-40 w-40 rounded-full bg-rose-200/20 blur-2xl" />

        <div className="relative flex flex-col items-center gap-10 p-8 md:flex-row md:p-16">
          {/* Copy */}
          <div className="z-10 flex flex-1 flex-col items-center text-center md:items-start md:text-left">
            <Badge className="mb-6 border border-amber-200 bg-amber-50 text-amber-600">
              <MaterialIcon name="auto_stories" className="text-sm" />
              Best Seller
            </Badge>

            <h2 className="font-serif-display mb-4 text-3xl font-black leading-[1.1] text-text-main md:text-5xl">
              Ready to join our <span className="gradient-text">community</span>?
            </h2>

            <p className="mb-8 max-w-md text-lg leading-relaxed text-text-muted">
              Visit our shop on Main Street, order our official cookbook, or start sharing your own frozen creations with us today.
            </p>

            <div className="flex w-full flex-col sm:flex-row gap-4">
              <Button className="h-12 flex-1 px-8 text-base shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40">
                Get Directions
              </Button>
              <Button
                variant="outline"
                className="h-12 flex-1 border-primary/30 px-8 text-base hover:border-primary hover:bg-primary/5"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Decorative Image Area */}
          <div className="flex w-full max-w-[400px] flex-1 items-center justify-center md:max-w-none">
            <div className="relative w-full">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-primary/20 via-primary/10 to-rose-200/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/15">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1LHDEgY0UHJ3WB7i4zAS4n0LYCWM8h6aYA0fIPs6haR_jcQopVJwYqyf7trDRQejzDvffZbCHsjeudFEv-rub3xymgQ3Rio8toJ7sN5rGu-V0v66H3hUHUqdvTDbLLc-JZH136816WJWj6cl97CFEVED-xjuQ6ZfQ9ExrD3Wq-Vtz5FdmqIhQ7_dnaM8aMvrJUraLSMhP_gfiS2j0MuwbJSX721aNn7p6qez6Ojfk36XYFYU6fv4rSyxe1c7RqaZ6wNZsrq6GGXQ"
                  alt="Mr. A holding ice cream"
                  width={400}
                  height={500}
                  className="aspect-[3/4] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}