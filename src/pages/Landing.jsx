import {
  ArrowRight,
  Radio,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  Users,
  Award,
  Smartphone,
  BarChart3,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Landing() {
  // Define animation variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="bg-[var(--landing-background)] dark:bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--landing-background)] dark:bg-background h-[calc(100vh-4.6rem)] flex items-center">
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--landing-primary)]/30 rounded-full blur-3xl mix-blend-multiply"
          ></motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl mix-blend-multiply"
          ></motion.div>
        </div>

        <div className="relative w-full max-w-[80%] mx-auto px-4 sm:px-6 py-8">
          <div className="grid md:grid-cols-2 gap-5 items-center">
            {/* Mobile Logo - Shown only on mobile at top */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative md:hidden flex items-center justify-center mb-6"
            >
              <div className="relative w-full max-w-[250px]">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-[var(--landing-primary)]/30 to-blue-400/30 rounded-3xl blur-3xl"
                ></motion.div>
                <div className="relative rounded-3xl border-2 border-[var(--landing-primary)]/30 dark:border-border backdrop-blur-sm bg-white/80 dark:bg-card/80 p-0 shadow-2xl">
                  <img
                    src="/images/new_logo_RFID2.png"
                    alt="SmartTrace Pulse Logo"
                    className="w-full h-auto object-contain rounded-3xl"
                  />
                </div>
              </div>
            </motion.div>

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-2xl md:text-4xl lg:text-[42px] font-bold text-[var(--landing-text)] dark:text-foreground leading-tight text-center"
                >
                  Traçabilité des{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--landing-primary)] to-blue-500">
                    Véhicules Neufs
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-base md:text-lg text-[var(--landing-text)]/70 dark:text-muted-foreground max-w-2xl text-center"
                >
                  Transformez votre gestion logistique avec{" "}
                  <strong className="text-[var(--landing-primary)]">SmartTrace Pulse</strong>. Une solution RFID simple et
                  performante pour localiser vos véhicules, fluidifier les
                  opérations et garantir une traçabilité sans faille.
                </motion.p>

                {/* Features Grid */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariant}
                  className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md sm:max-w-3xl mx-auto"
                >
                  {[
                    {
                      icon: Truck,
                      title: "Traçabilité complète",
                      text: "Localisez vos véhicules dans chaque zone : port, stockage, atelier ou livraison.",
                    },
                    {
                      icon: BarChart3,
                      title: "Analyse & performance",
                      text: "Consultez vos indicateurs clés : taux d'occupation, délais, conformité.",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Fiabilité & sécurité",
                      text: "Des données précises, sécurisées et toujours alignées avec la réalité terrain.",
                    },
                  ].map((feature, i) => {
                    const IconComponent = feature.icon;
                    return (
                      <motion.div
                        key={i}
                        variants={itemVariant}
                        className="flex flex-col items-center text-center backdrop-blur-sm p-3 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-all"
                      >
                        <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 mb-2 text-[var(--landing-primary)] group-hover:scale-110 transition-transform duration-300" />
                        <h4 className="text-sm font-semibold text-[var(--landing-text)] dark:text-foreground mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-[var(--landing-text)]/70 dark:text-muted-foreground leading-tight">
                          {feature.text}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex  sm:flex-row gap-4 pt-4 justify-center"
              >
                <Link to="/login">
                  <Button className="flex items-center justify-center text-lg space-x-2 px-8 py-6 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-[var(--landing-primary)]/50 hover:shadow-xl hover:shadow-[var(--landing-primary)]/60 transform hover:scale-105 bg-[var(--landing-primary)] text-white hover:bg-[var(--landing-primary)]/90">
                    <span>Se connecter</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Logo - Desktop only */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative hidden md:flex items-center justify-center"
            >
              <div className="relative w-full max-w-lg">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-[var(--landing-primary)]/30 to-blue-400/30 rounded-3xl blur-3xl"
                ></motion.div>
                <div className="relative rounded-3xl border-2 border-[var(--landing-primary)]/30 dark:border-border backdrop-blur-sm bg-white/80 dark:bg-card/80 p-0 shadow-2xl">
                  <img
                    src="/images/new_logo_RFID2.png"
                    alt="SmartTrace Pulse Logo"
                    className="w-full h-auto object-contain rounded-3xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatItem({ label, value, icon: Icon }) {
  return (
    <div className="text-center">
      <Icon className="w-12 h-12 text-[var(--landing-primary)] mx-auto mb-4" />
      <p className="text-[var(--landing-text)] dark:text-foreground text-3xl font-bold mb-2">
        {value}
      </p>
      <p className="text-[var(--landing-text)]/70 dark:text-muted-foreground">{label}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white dark:bg-card rounded-xl border border-[var(--landing-primary)]/20 dark:border-border px-5 py-7 hover:border-[var(--landing-primary)] transition-all duration-300 group h-full flex flex-col text-center">
      <div className="flex flex-row items-center justify-center mb-4 space-x-3">
        <div className="inline-flex p-2 rounded-lg bg-[var(--landing-primary)]/10 group-hover:bg-[var(--landing-primary)]/20 transition-colors w-fit">
          <Icon className="w-6 h-6 text-[var(--landing-primary)]" />
        </div>
        <h3 className="text-[var(--landing-text)] dark:text-foreground font-bold text-xl ">
          {title}
        </h3>
      </div>
      <p className="text-[var(--landing-text)]/70 dark:text-muted-foreground flex-grow">
        {description}
      </p>
    </div>
  );
}