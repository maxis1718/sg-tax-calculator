import { useLanguage } from "../contexts/LanguageContext";
import { useURLParam } from "../contexts/URLParamContext";

export function SEOHead() {
  const { language, t } = useLanguage();
  const { income } = useURLParam();

  // 根據是否有收入參數來調整 SEO 內容
  const getOptimizedContent = () => {
    const baseTitle = `${t("title")} 2025`;
    const baseDescription =
      `${t("seoDescription")} Updated for 2025 tax year.` ||
      "Calculate your Singapore income tax and CPF contributions instantly for 2025. Free, accurate, and supports multiple languages.";

    if (income && income > 0) {
      const formattedIncome = income.toLocaleString("en-SG");
      return {
        title: `${baseTitle} - $${formattedIncome} ${
          t("seoTitleSuffix") || "Tax Calculator"
        }`,
        description: `Calculate 2025 tax for $${formattedIncome} annual income in Singapore. ${baseDescription}`,
      };
    }

    return {
      title: baseTitle,
      description: baseDescription,
    };
  };

  const { title, description } = getOptimizedContent();

  // 語言代碼映射
  const langMap: Record<string, string> = {
    en: "en-SG",
    "zh-Hans": "zh-CN",
    "zh-Hant": "zh-TW",
    ms: "ms-MY",
    ta: "ta-SG",
  };

  const currentLang = langMap[language] || "en-SG";
  // 在預渲染環境中，直接使用生產域名
  const baseUrl =
    typeof window !== "undefined" &&
    window.location.origin.includes("sgtaxcalculator.com")
      ? window.location.origin
      : "https://sgtaxcalculator.com";

  const canonical = `${baseUrl}${language !== "en" ? `/${language}` : ""}${
    income ? `?income=${income}` : ""
  }`;

  return (
    <>
      {/* React 19 原生支持！直接渲染到 head */}
      <title>{title}</title>

      {/* 基本 SEO */}
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="Singapore tax calculator 2025, income tax 2025, CPF calculator 2025, tax computation 2025, 新加坡稅務計算器 2025, cukai pendapatan Singapura 2025, சிங்கப்பூர் வரி கணிப்பாளர் 2025"
      />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="SG Tax Calculator 2025" />
      <meta property="og:locale" content={currentLang} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* 技術 meta */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="SG Tax Calculator" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* 多語言 alternate links */}
      <link rel="alternate" hrefLang="en" href="https://sgtaxcalculator.com" />
      <link
        rel="alternate"
        hrefLang="zh-CN"
        href="https://sgtaxcalculator.com/zh-Hans"
      />
      <link
        rel="alternate"
        hrefLang="zh-TW"
        href="https://sgtaxcalculator.com/zh-Hant"
      />
      <link
        rel="alternate"
        hrefLang="ms"
        href="https://sgtaxcalculator.com/ms"
      />
      <link
        rel="alternate"
        hrefLang="ta"
        href="https://sgtaxcalculator.com/ta"
      />
      <link
        rel="alternate"
        hrefLang="x-default"
        href="https://sgtaxcalculator.com"
      />
    </>
  );
}
