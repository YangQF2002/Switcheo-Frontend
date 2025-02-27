// Did not have relevant import statements 
import React from "react";
import { useEffect, useMemo, useState } from "react";

interface WalletBalance {
  currency: string;
  amount: number;
  
  // Extra type to fit with rest of given code 
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface CurrencyDetails {
  currency: string;
  date: Date;
  price: number;
}

interface WalletRowProps extends Omit<FormattedWalletBalance , 'blockchain'> {
  totalValue: number;
}

// Did not define the BoxProps type
type BoxProps = React.HTMLAttributes<HTMLDivElement>;
interface Props extends BoxProps {}

// Placeholder for useWalletBalances hook
const useWalletBalances = (): WalletBalance[] => {
  return [
    { currency: "OSMO", amount: 1, blockchain: "Osmosis" },
    { currency: "ETH", amount: 2, blockchain: "Ethereum" },
    { currency: "ARB", amount: 3, blockchain: "Arbitrum" },
    { currency: "ZIL", amount: 4, blockchain: "Zilliqa" }, 
    { currency: "NEO", amount: 5, blockchain: "Neo" },
  ];
};

// Implemented the Datasource class to integrate with rest of code
class Datasource {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getPrices(): Promise<Record<string, number>> {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch prices: ${response.statusText}`);
      }

      const jsonResult: CurrencyDetails[] = await response.json();

      // Extract out prices from the raw json result!
      const prices: Record<string, number> = {};
      for (let i = 0; i < jsonResult.length; i++) {
        const currency: string = jsonResult[i].currency;
        const usdPrice: number = jsonResult[i].price;
        prices[currency] = usdPrice;
      }
      return prices;

    } catch (error) {
      console.error("Error fetching prices:", error);
      return {};
    }
  }
}

// Define the WalletRow subcomponent 
const WalletRow: React.FC<WalletRowProps> = ({currency, amount, totalValue, formatted}) => {
  // Please excuse the lack of styling :D
  return (
    <div>
      <div>{currency}</div>
      <div>{amount}</div>
      <div>{totalValue}</div>
      <div>{formatted}</div>
    </div>
  )
}

// We probably want this component to be exported
// To be accessible elsewhere in the project
export const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;

  // Include explicit typing for better readability
  // Prices should be a record (immutable) of currency to usdPrice mappings!
  const balances: WalletBalance[] = useWalletBalances();
  const [prices, setPrices] = useState<Record<string, number>>({});

  // On component mount, get prices 
  useEffect(() => {
    const datasource = new Datasource(
      "https://interview.switcheo.com/prices.json"
    );

    datasource
      .getPrices()
      .then((prices) => {
        setPrices(prices);
      })

      .catch((error) => {
        // Should be console.error instead of console.err
        console.error(error);
      });
  }, []);

  // More explicit typing of blockchain, instead of any
  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;

      case "Ethereum":
        return 50;

      case "Arbitrum":
        return 30;

      case "Zilliqa":
        return 20;

      case "Neo":
        return 20;

      default:
        return -99;
    }
  };

  // Memoized function call 
  const sortedFormattedBalances: FormattedWalletBalance[] = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // This should just be balancePriority, lhsPriority is undefined here
        if (balancePriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // Comparison function provided into sort should always return a number!
        return 0;
      })

      // The map part can also be memoized!
      .map((balance: WalletBalance) => {
        return {
          ...balance,
          formatted: balance.amount.toFixed(),
        };
      });

      // Removed prices from the dependency array 
      // Since the function should only be recomputed when balances change! 
  }, [balances]);

  const rows = sortedFormattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue: number = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          key={index}
          currency={balance.currency}
          amount={balance.amount}
          totalValue={usdValue}
          formatted={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};


