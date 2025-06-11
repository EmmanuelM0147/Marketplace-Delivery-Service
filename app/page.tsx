import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Leaf, Truck, Shield, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80"
          alt="Farm landscape"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="container relative z-10 text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Farm Fresh, Delivered Direct
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Connect directly with local farmers for fresh, sustainably grown produce delivered straight to your door.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Shop Local Produce
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              Join as Farmer
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container py-12">
        <h2 className="text-3xl font-bold mb-8">Fresh from Local Farms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Seasonal Vegetables",
              image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80",
              items: "1,456",
              badge: "Just Harvested"
            },
            {
              title: "Organic Fruits",
              image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80",
              items: "890",
              badge: "Pesticide Free"
            },
            {
              title: "Farm Fresh Eggs",
              image: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80",
              items: "234",
              badge: "Free Range"
            }
          ].map((category, index) => (
            <Card key={index} className="group cursor-pointer overflow-hidden">
              <CardContent className="p-0 relative h-[300px]">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end">
                  <Badge variant="secondary" className="self-start mb-2">
                    {category.badge}
                  </Badge>
                  <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                  <p className="text-white/80">{category.items} items</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted py-12">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Gardenia</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Leaf className="h-8 w-8 text-green-600" />,
                title: "Farm Fresh",
                description: "Produce harvested at peak freshness and delivered within 24 hours"
              },
              {
                icon: <Truck className="h-8 w-8 text-blue-600" />,
                title: "Local Delivery",
                description: "Temperature-controlled delivery to maintain freshness"
              },
              {
                icon: <Shield className="h-8 w-8 text-red-600" />,
                title: "Quality Assured",
                description: "Rigorous quality standards and freshness guarantee"
              },
              {
                icon: <Users className="h-8 w-8 text-purple-600" />,
                title: "Support Local",
                description: "Direct support for local farmers and communities"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Farmers */}
      <section className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Meet Our Farmers</h2>
          <Link href="/farmers">
            <Button variant="outline">View All Farmers</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Green Acres Farm",
              image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80",
              specialty: "Organic Vegetables",
              location: "Lagos State"
            },
            {
              name: "Sunshine Orchards",
              image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80",
              specialty: "Tropical Fruits",
              location: "Oyo State"
            },
            {
              name: "Heritage Poultry",
              image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80",
              specialty: "Free Range Eggs",
              location: "Kaduna State"
            }
          ].map((farmer, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video relative">
                  <Image
                    src={farmer.image}
                    alt={farmer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{farmer.name}</h3>
                  <p className="text-muted-foreground mb-4">{farmer.specialty}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Leaf className="h-4 w-4 mr-2" />
                    {farmer.location}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quality Guarantee */}
      <section className="bg-green-50 dark:bg-green-950/20 py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="h-12 w-12 mx-auto mb-6 text-green-600" />
            <h2 className="text-3xl font-bold mb-4">Our Quality Guarantee</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Every product on our platform meets strict quality standards. If you're not 100% satisfied with your purchase, we'll make it right.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                "Freshness Guaranteed",
                "Quality Inspected",
                "Satisfaction Assured"
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-center p-4 bg-background rounded-lg">
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}