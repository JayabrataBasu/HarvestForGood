import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto">
      {/* Hero section */}
      <section className="py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Advancing Sustainable Food Systems Research</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Harvest For Good connects researchers, practitioners, and communities to build a more equitable and sustainable food future through collaborative research and knowledge sharing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/research" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Explore Research
          </Link>
          <Link href="/forums" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
            Join the Discussion
          </Link>
        </div>
      </section>
      
      {/* Mission statement */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe that academic research should be accessible, actionable, and aligned with community needs. 
            Our platform bridges the gap between researchers and practitioners to create meaningful change in food systems worldwide.
          </p>
        </div>
      </section>
    </div>
  );
}
