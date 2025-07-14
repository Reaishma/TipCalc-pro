
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Globe, Receipt, Percent, Users, RotateCcw, Download } from "lucide-react";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface CalculationResult {
  tipAmount: number;
  totalAmount: number;
  amountPerPerson: number;
}

const slideInVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const fadeUpVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};
const bounceInVariants = {
  hidden: { scale: 0.3, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
      duration: 0.8
    }
  }
};

const numberChangeVariants = {
  initial: { scale: 1.2 },
  animate: { scale: 1 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export default function Home() {
  const [currency, setCurrency] = useState("USD");
  const [billAmount, setBillAmount] = useState("");
  const [tipPercentage, setTipPercentage] = useState(0);
  const [peopleCount, setPeopleCount] = useState(1);
  const [customTip, setCustomTip] = useState("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const { toast } = useToast();

  const { data: currencies } = useQuery<Currency[]>({
    queryKey: ["/api/currencies"],
    staleTime: Infinity,
  });

  const calculateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/calculate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      setIsCalculating(false);
    },
    onError: (error) => {
      toast({
        title: "Calculation Error",
        description: error.message,
        variant: "destructive",
      });
      setIsCalculating(false);
    },
  });

  const currentCurrency = currencies?.find(c => c.code === currency);

  const formatCurrency = (amount: number) => {
    const symbol = currentCurrency?.symbol || "$";
    if (currency === "JPY") {
      return `${symbol}${Math.round(amount).toLocaleString()}`;
    }
    return `${symbol}${amount.toFixed(2)}`;
  };

  const handleCalculate = () => {
    const bill = parseFloat(billAmount) || 0;
    if (bill <= 0) return;

    setIsCalculating(true);
    setTimeout(() => {
      calculateMutation.mutate({
        currency,
        billAmount: bill,
        tipPercentage,
        peopleCount,
      });
    }, 300);
  };

  const handleTipButtonClick = (percentage: number) => {
    setTipPercentage(percentage);
    setCustomTip(percentage.toString());
    handleCalculate();
  };

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value);
    const percentage = parseFloat(value) || 0;
    setTipPercentage(percentage);
    if (percentage > 0) {
      handleCalculate();
    }
  };

  const handleReset = () => {
    setBillAmount("");
    setTipPercentage(0);
    setPeopleCount(1);
    setCustomTip("");
    setResult(null);
  };

  const handlePeopleChange = (increment: boolean) => {
    const newCount = increment ? peopleCount + 1 : Math.max(1, peopleCount - 1);
    setPeopleCount(newCount);
    if (parseFloat(billAmount) > 0 && tipPercentage > 0) {
      handleCalculate();
    }
  };

  useEffect(() => {
    if (parseFloat(billAmount) > 0 && tipPercentage > 0) {
      handleCalculate();
    }
  }, [billAmount, currency]);

  // PWA Installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setShowInstallPrompt(true);
      (window as any).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    const deferredPrompt = (window as any).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setShowInstallPrompt(false);
      (window as any).deferredPrompt = null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-inter">
      {/* PWA Install Button */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={handleInstallClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg glow-effect"
              size="lg"
            >
              <Download className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          custom={0}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            TipCalc Pro
          </h1>
          <p className="text-slate-400 text-lg">Smart tip calculator with multi-currency support</p>
          <div className="mt-4 flex justify-center space-x-2">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-emerald-500 rounded-full"
            />
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-indigo-500 rounded-full"
            />
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-purple-500 rounded-full"
            />
          </div>
        </motion.header>

        {/* Main Calculator Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={bounceInVariants}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 glow-effect">
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                  {/* Currency Selector */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={slideInVariants}
                    custom={0}
                  >
                    <Label className="flex items-center text-slate-300 mb-3">
                      <Globe className="mr-2 h-4 w-4" />
                      Currency
                    </Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-colors text-white">
                        <SelectValue className="text-white" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {currencies?.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code} className="text-white hover:bg-slate-700 focus:bg-slate-700">
                            {curr.flag} {curr.code} - {curr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* Bill Amount */}
                  <motion.div
                    initial="hidden"
                   initialalate="visible"
                    variants={slideInVariants}
                    custom={1}
                  >
                    <Label className="flex items-center text-slate-300 mb-3">
                      <Receipt className="mr-2 h-4 w-4" />
                      Bill Amount
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                        {currentCurrency?.symbol || "$"}
                      </span>
                      <Input
                        type="number"
                        value={billAmount}
                        onChange={(e) => setBillAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-slate-700 border-slate-600 pl-12 text-lg text-white placeholder-slate-400 hover:bg-slate-600 transition-colors"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </motion.div>

                  {/* Tip Percent */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={slideInVariants}
                    custom={2}
                  >
                    <Label className="flex items-center text-slate-300 mb-3">
                      <Percent className="mr-2 h-4 w-4" />
                      Tip Percent
                    </Label>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {[15, 18, 20, 25].map((percentage) => (
                        <motion.div
                          key={percentage}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={() => handleTipButtonClick(percentage)}
                            variant={tipPercentage === percentage ? "default" : "outline"}
                            className={`w-full transition-all duration-300 text-white ${
                              tipPercentage === percentage
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 glow-effect"
                                : "bg-slate-700 hover:bg-slate-600 border-slate-600"
                            }`}
                          >
                            {percentage}%
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        value={customTip}
                        onChange={(e) => handleCustomTipChange(e.target.value)}
                        placeholder="Custom percentage"
                        className="bg-slate-700 border-slate-600 pr-12 text-white placeholder-slate-400 hover:bg-slate-600 transition-colors"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                        %
                      </span>
                    </div>
                  </motion.div>

                  {/* Number of People */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={slideInVariants}
                    custom={3}
                  >
                    <Label className="flex items-center text-slate-300 mb-3">
                      <Users className="mr-2 h-4 w-4" />
                      Number of People
                    </Label>
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={() => handlePeopleChange(false)}
                        disabled={peopleCount <= 1}
                        variant="outline"
                        size="icon"
                        className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-colors text-white"
                      >
                        -
                      </Button>
                      <div className="flex-1 text-center">
                        <motion.span
                          key={peopleCount}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="text-3xl font-bold text-white"
                        >
                          {peopleCount}
                        </motion.span>
                        <div className="text-sm text-slate-400">People</div>
                      </div>
                      <Button
                        onClick={() => handlePeopleChange(true)}
                        disabled={peopleCount >= 50}
                        variant="outline"
                        size="icon"
                        className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-colors text-white"
                      >
                        +
                      </Button>
                    </div>
                  </motion.div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUpVariants}
                    custom={4}
                  >
                    <h3 className="flex items-center text-xl font-semibold text-slate-300 mb-4">
                      <Calculator className="mr-2 h-5 w-5" />
                      Calculation Results
                    </h3>

                    {/* Tip Amount */}
                    <motion.div
                      className="bg-slate-700/50 rounded-xl p-4 mb-4 border border-slate-600 hover:border-indigo-500 transition-all duration-300 card-hover"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Tip Amount</span>
                        <motion.span
                          key={result?.tipAmount || 0}
                          variants={numberChangeVariants}
                          initial="initial"
                          animate="animate"
                          className="text-2xl font-bold text-emerald-400"
                        >
                          {result ? formatCurrency(result.tipAmount) : formatCurrency(0)}
                        </motion.span>
                      </div>
                    </motion.div>

                    {/* Total Amount */}
                    <motion.div
                      className="bg-slate-700/50 rounded-xl p-4 mb-4 border border-slate-600 hover:border-indigo-500 transition-all duration-300 card-hover"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Total Amount</span>
                        <motion.span
                          key={result?.totalAmount || 0}
                          variants={numberChangeVariants}
                          initial="initial"
                          animate="animate"
                          className="text-2xl font-bold text-indigo-400"
                        >
                          {result ? formatCurrency(result.totalAmount) : formatCurrency(0)}
                        </motion.span>
                      </div>
                    </motion.div>

                    {/* Amount Per Person */}
                    <motion.div
                      className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl p-4 border border-indigo-500/50 glow-effect"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-slate-200 font-medium">Amount Per Person</span>
                        <motion.span
                          key={result?.amountPerPerson || 0}
                          variants={numberChangeVariants}
                          initial="initial"
                          animate="animate"
                          className="text-3xl font-bold text-white"
                        >
                          {result ? formatCurrency(result.amountPerPerson) : formatCurrency(0)}
                        </motion.span>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Breakdown Chart */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUpVariants}
                    custom={5}
                  >
                    <h4 className="text-lg font-medium text-slate-300 mb-3">
                      Breakdown
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-slate-300">Bill</span>
                        </div>
                        <span className="text-slate-400">
                          {result ? Math.round((parseFloat(billAmount) / result.totalAmount) * 100) : 100}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                          <span className="text-slate-300">Tip</span>
                        </div>
                        <span className="text-slate-400">
                          {result ? Math.round((result.tipAmount / result.totalAmount) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="flex h-2 rounded-full overflow-hidden">
                          <motion.div
                            className="bg-blue-500 transition-all duration-500"
                            style={{
                              width: result ? `${(parseFloat(billAmount) / result.totalAmount) * 100}%` : "100%"
                            }}
                            initial={{ width: "100%" }}
                            animate={{
                              width: result ? `${(parseFloat(billAmount) / result.totalAmount) * 100}%` : "100%"
                            }}
                          />
                          <motion.div
                            className="bg-emerald-500 transition-all duration-500"
                            style={{
                              width: result ? `${(result.tipAmount / result.totalAmount) * 100}%` : "0%"
                            }}
                            initial={{ width: "0%" }}
                            animate={{
                              width: result ? `${(result.tipAmount / result.totalAmount) * 100}%` : "0%"
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Reset Button */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUpVariants}
                    custom={6}
                  >
                    <Button
                      onClick={handleReset}
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pin