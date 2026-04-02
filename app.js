const STORAGE_KEY = "sake-oem-quote-form-v5";
const SAVED_QUOTES_KEY = "sake-oem-quote-snapshots-v1";

const numericFields = new Set([
  "targetAlcoholPercent",
  "bottleSizeMl",
  "bottlesPerLot",
  "lotCount",
  "expectedLossRate",
  "plannedBrewVolumeLiters",
  "brownRiceCostPerKg",
  "ricePolishingRatio",
  "litersPerKgWhiteRice",
  "kojiRatioPercent",
  "baseSakeAlcoholPercent",
  "genshuContributionPercent",
  "alcoholContributionPercent",
  "alcoholCostPerLiter",
  "alcoholStrengthPercent",
  "otherLiquorContributionPercent",
  "otherLiquorCostPerLiter",
  "otherLiquorAlcoholPercent",
  "fruitIngredientBlendPercent",
  "fruitIngredientCostPerLiter",
  "fruitIngredientProcessingFee",
  "fruitIngredientAlcoholPercent",
  "otherRawMaterialCostPerLiter",
  "brewingDays",
  "staffCount",
  "laborCostPerPersonDay",
  "facilityUtilityCostPerLiter",
  "bottleCostPerBottle",
  "capCostPerBottle",
  "labelCostPerBottle",
  "cartonCostPerBottle",
  "fillingCostPerBottle",
  "qaCostPerBottle",
  "logisticsCostPerBottle",
  "developmentFee",
  "designFee",
  "adminFee",
  "miscFee",
  "marginRate",
  "taxRate"
]);

const categoryLabels = {
  sake: "清酒",
  liqueur: "リキュール",
  fruit_wine: "果実酒",
  spirits: "スピリッツ"
};

const PACKAGING_BAND_COUNT = 5;
const packagingCostKeys = [
  "bottleCostPerBottle",
  "capCostPerBottle",
  "labelCostPerBottle",
  "cartonCostPerBottle",
  "fillingCostPerBottle",
  "qaCostPerBottle",
  "logisticsCostPerBottle"
];

for (let bandIndex = 1; bandIndex <= PACKAGING_BAND_COUNT; bandIndex += 1) {
  numericFields.add(`packagingBand${bandIndex}MinMl`);
  numericFields.add(`packagingBand${bandIndex}MaxMl`);

  for (const key of packagingCostKeys) {
    numericFields.add(`packagingBand${bandIndex}${key[0].toUpperCase()}${key.slice(1)}`);
  }
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function defaultQuoteNumber() {
  return `OEM-${todayString().replaceAll("-", "")}-001`;
}

function createPackagingBandDefaults() {
  return {
    packagingBand1MinMl: 180,
    packagingBand1MaxMl: 300,
    packagingBand1BottleCostPerBottle: 64,
    packagingBand1CapCostPerBottle: 14,
    packagingBand1LabelCostPerBottle: 18,
    packagingBand1CartonCostPerBottle: 40,
    packagingBand1FillingCostPerBottle: 34,
    packagingBand1QaCostPerBottle: 14,
    packagingBand1LogisticsCostPerBottle: 20,
    packagingBand2MinMl: 301,
    packagingBand2MaxMl: 500,
    packagingBand2BottleCostPerBottle: 78,
    packagingBand2CapCostPerBottle: 16,
    packagingBand2LabelCostPerBottle: 21,
    packagingBand2CartonCostPerBottle: 52,
    packagingBand2FillingCostPerBottle: 40,
    packagingBand2QaCostPerBottle: 17,
    packagingBand2LogisticsCostPerBottle: 24,
    packagingBand3MinMl: 501,
    packagingBand3MaxMl: 720,
    packagingBand3BottleCostPerBottle: 92,
    packagingBand3CapCostPerBottle: 18,
    packagingBand3LabelCostPerBottle: 24,
    packagingBand3CartonCostPerBottle: 65,
    packagingBand3FillingCostPerBottle: 48,
    packagingBand3QaCostPerBottle: 20,
    packagingBand3LogisticsCostPerBottle: 28,
    packagingBand4MinMl: 721,
    packagingBand4MaxMl: 900,
    packagingBand4BottleCostPerBottle: 108,
    packagingBand4CapCostPerBottle: 20,
    packagingBand4LabelCostPerBottle: 28,
    packagingBand4CartonCostPerBottle: 78,
    packagingBand4FillingCostPerBottle: 54,
    packagingBand4QaCostPerBottle: 23,
    packagingBand4LogisticsCostPerBottle: 33,
    packagingBand5MinMl: 901,
    packagingBand5MaxMl: 1800,
    packagingBand5BottleCostPerBottle: 132,
    packagingBand5CapCostPerBottle: 24,
    packagingBand5LabelCostPerBottle: 32,
    packagingBand5CartonCostPerBottle: 96,
    packagingBand5FillingCostPerBottle: 68,
    packagingBand5QaCostPerBottle: 28,
    packagingBand5LogisticsCostPerBottle: 40
  };
}

function createDefaultForm() {
  return {
    issuedOn: todayString(),
    quoteNumber: defaultQuoteNumber(),
    clientName: "株式会社サンプル商事",
    projectName: "2026年秋冬向け OEM リキュール",
    productName: "柚子リキュール OEM",
    sakeType: "リキュール",
    taxCategory: "liqueur",
    targetAlcoholPercent: 10,
    bottleSizeMl: 720,
    bottlesPerLot: 1200,
    lotCount: 0,
    expectedLossRate: 3,
    plannedBrewVolumeLiters: 2700,
    brownRiceCostPerKg: 420,
    ricePolishingRatio: 60,
    litersPerKgWhiteRice: 2.25,
    kojiRatioPercent: 22,
    baseSakeAlcoholPercent: 17,
    genshuContributionPercent: 72,
    alcoholContributionPercent: 18,
    alcoholCostPerLiter: 215,
    alcoholStrengthPercent: 95,
    otherLiquorName: "ブレンド酒",
    otherLiquorContributionPercent: 10,
    otherLiquorCostPerLiter: 280,
    otherLiquorAlcoholPercent: 12,
    fruitIngredientName: "果汁等",
    fruitIngredientBlendPercent: 8,
    fruitIngredientCostPerLiter: 340,
    fruitIngredientProcessingFee: 25000,
    fruitIngredientAlcoholPercent: 0,
    otherRawMaterialCostPerLiter: 36,
    brewingDays: 28,
    staffCount: 3,
    laborCostPerPersonDay: 18000,
    facilityUtilityCostPerLiter: 45,
    ...createPackagingBandDefaults(),
    bottleCostPerBottle: 92,
    capCostPerBottle: 18,
    labelCostPerBottle: 24,
    cartonCostPerBottle: 65,
    fillingCostPerBottle: 48,
    qaCostPerBottle: 20,
    logisticsCostPerBottle: 28,
    developmentFee: 80000,
    designFee: 50000,
    adminFee: 40000,
    miscFeeLabel: "酒税申告・申請補助",
    miscFee: 30000,
    marginRate: 22,
    taxRate: 10,
    leadTime: "正式発注後 45 日",
    paymentTerms: "納品月末締め翌月末払い",
    note: "ラベルデザイン支給、一括納品を前提とした試算です。"
  };
}

function sanitizeNumber(value) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function roundCurrency(value) {
  return Math.round(value);
}

function roundQuantity(value) {
  return Number(value.toFixed(2));
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `saved-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatCurrency(value) {
  return `¥${new Intl.NumberFormat("ja-JP").format(roundCurrency(value))}`;
}

function formatQuantity(value) {
  return new Intl.NumberFormat("ja-JP", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
}

function createLineItem(label, unit, quantity, unitPrice, category) {
  const safeQuantity = sanitizeNumber(quantity);
  const safeUnitPrice = sanitizeNumber(unitPrice);

  return {
    label,
    unit,
    quantity: roundQuantity(safeQuantity),
    unitPrice: roundCurrency(safeUnitPrice),
    total: roundCurrency(safeQuantity * safeUnitPrice),
    category
  };
}

function withPackagingLabel(label, appliedPackaging) {
  return appliedPackaging.usesBand ? `${label} (${appliedPackaging.label})` : label;
}

function getPackagingBandCostFieldName(bandIndex, costKey) {
  return `packagingBand${bandIndex}${costKey[0].toUpperCase()}${costKey.slice(1)}`;
}

function getAppliedPackagingRates(form, bottleSizeMl) {
  for (let bandIndex = 1; bandIndex <= PACKAGING_BAND_COUNT; bandIndex += 1) {
    const minMl = sanitizeNumber(form[`packagingBand${bandIndex}MinMl`]);
    const maxMl = sanitizeNumber(form[`packagingBand${bandIndex}MaxMl`]);

    if (maxMl <= 0 || maxMl < minMl) {
      continue;
    }

    if (bottleSizeMl >= minMl && bottleSizeMl <= maxMl) {
      const rates = Object.fromEntries(
        packagingCostKeys.map((key) => [key, sanitizeNumber(form[getPackagingBandCostFieldName(bandIndex, key)])])
      );

      return {
        bandIndex,
        label: `容量帯${bandIndex} (${formatQuantity(minMl)}-${formatQuantity(maxMl)}ml)`,
        minMl,
        maxMl,
        rates,
        usesBand: true
      };
    }
  }

  return {
    bandIndex: 0,
    label: "共通単価",
    minMl: 0,
    maxMl: 0,
    rates: Object.fromEntries(packagingCostKeys.map((key) => [key, sanitizeNumber(form[key])])),
    usesBand: false
  };
}

function getLiquorTaxRatePerKl(category, abv) {
  const alcoholPercent = sanitizeNumber(abv);

  if (category === "sake") {
    return 100000;
  }

  if (category === "fruit_wine") {
    return 100000;
  }

  if (category === "spirits") {
    return alcoholPercent >= 37 ? 370000 + (alcoholPercent - 37) * 10000 : 370000;
  }

  if (alcoholPercent < 9) {
    return 80000;
  }

  if (alcoholPercent < 13) {
    return 80000 + (alcoholPercent - 8) * 10000;
  }

  return 120000 + Math.max(alcoholPercent - 12, 0) * 10000;
}

function calculateQuote(form) {
  const requestedShipmentVolumeLiters = sanitizeNumber(form.plannedBrewVolumeLiters);
  const cappedLossRate = Math.min(sanitizeNumber(form.expectedLossRate), 95);
  const yieldRate = 1 - cappedLossRate / 100;
  const bottleSizeMl = sanitizeNumber(form.bottleSizeMl);
  const requestedBottleCount = bottleSizeMl > 0 ? Math.floor((requestedShipmentVolumeLiters * 1000) / bottleSizeMl) : 0;
  const orderedVolumeLiters = bottleSizeMl > 0 ? (requestedBottleCount * bottleSizeMl) / 1000 : requestedShipmentVolumeLiters;
  const taxableVolumeLiters = orderedVolumeLiters > 0 ? orderedVolumeLiters : requestedShipmentVolumeLiters;
  const productionVolumeLiters = yieldRate > 0 ? taxableVolumeLiters / yieldRate : taxableVolumeLiters;
  const lossVolumeLiters = Math.max(productionVolumeLiters - taxableVolumeLiters, 0);

  const finalBlendVolumeLiters = productionVolumeLiters;
  const targetAlcoholPercent = sanitizeNumber(form.targetAlcoholPercent);
  const targetAlcoholLiters = finalBlendVolumeLiters * (targetAlcoholPercent / 100);
  const baseSakeAlcoholRate = sanitizeNumber(form.baseSakeAlcoholPercent) / 100;
  const rawAlcoholRate = sanitizeNumber(form.alcoholStrengthPercent) / 100;
  const otherLiquorRate = sanitizeNumber(form.otherLiquorAlcoholPercent) / 100;

  const fruitIngredientVolume = finalBlendVolumeLiters * (sanitizeNumber(form.fruitIngredientBlendPercent) / 100);
  const fruitIngredientPure = fruitIngredientVolume * (sanitizeNumber(form.fruitIngredientAlcoholPercent) / 100);
  const alcoholicTargetLiters = Math.max(targetAlcoholLiters - fruitIngredientPure, 0);

  const contributionSeed = {
    genshu: sanitizeNumber(form.genshuContributionPercent),
    rawAlcohol: sanitizeNumber(form.alcoholContributionPercent),
    otherLiquor: sanitizeNumber(form.otherLiquorContributionPercent)
  };
  const contributionSum = contributionSeed.genshu + contributionSeed.rawAlcohol + contributionSeed.otherLiquor;
  const normalizedContribution =
    contributionSum > 0
      ? {
          genshu: contributionSeed.genshu / contributionSum,
          rawAlcohol: contributionSeed.rawAlcohol / contributionSum,
          otherLiquor: contributionSeed.otherLiquor / contributionSum
        }
      : {
          genshu: 1,
          rawAlcohol: 0,
          otherLiquor: 0
        };

  const genshuPureTarget = alcoholicTargetLiters * normalizedContribution.genshu;
  const rawAlcoholPure = alcoholicTargetLiters * normalizedContribution.rawAlcohol;
  const otherLiquorPure = alcoholicTargetLiters * normalizedContribution.otherLiquor;

  const genshuVolume = baseSakeAlcoholRate > 0 ? genshuPureTarget / baseSakeAlcoholRate : 0;
  const rawAlcoholVolume = rawAlcoholRate > 0 ? rawAlcoholPure / rawAlcoholRate : 0;
  const otherLiquorVolume = otherLiquorRate > 0 ? otherLiquorPure / otherLiquorRate : 0;
  const dilutionWaterVolume = Math.max(finalBlendVolumeLiters - genshuVolume - rawAlcoholVolume - otherLiquorVolume - fruitIngredientVolume, 0);
  const preDilutionVolume = genshuVolume + rawAlcoholVolume + otherLiquorVolume + fruitIngredientVolume;

  const bottleCount = requestedBottleCount;
  const lotCount = sanitizeNumber(form.bottlesPerLot) > 0 ? bottleCount / sanitizeNumber(form.bottlesPerLot) : 0;
  const shipmentGapLiters = requestedShipmentVolumeLiters - orderedVolumeLiters;
  const appliedPackaging = getAppliedPackagingRates(form, bottleSizeMl);

  const litersPerKgWhiteRice = sanitizeNumber(form.litersPerKgWhiteRice);
  const whiteRiceKg = litersPerKgWhiteRice > 0 ? genshuVolume / litersPerKgWhiteRice : 0;
  const polishingRatio = Math.min(Math.max(sanitizeNumber(form.ricePolishingRatio), 1), 100) / 100;
  const brownRiceKg = whiteRiceKg / polishingRatio;
  const kojiRatio = sanitizeNumber(form.kojiRatioPercent) / 100;
  const kojiRiceKg = whiteRiceKg * kojiRatio;
  const kakemaiKg = Math.max(whiteRiceKg - kojiRiceKg, 0);
  const laborPersonDays = sanitizeNumber(form.brewingDays) * sanitizeNumber(form.staffCount);

  const riceCost = brownRiceKg * sanitizeNumber(form.brownRiceCostPerKg);
  const alcoholCost = rawAlcoholVolume * sanitizeNumber(form.alcoholCostPerLiter);
  const otherLiquorCost = otherLiquorVolume * sanitizeNumber(form.otherLiquorCostPerLiter);
  const fruitIngredientCost = fruitIngredientVolume * sanitizeNumber(form.fruitIngredientCostPerLiter);
  const fruitIngredientProcessingCost = sanitizeNumber(form.fruitIngredientProcessingFee);
  const otherRawMaterialCost = genshuVolume * sanitizeNumber(form.otherRawMaterialCostPerLiter);
  const laborCost = laborPersonDays * sanitizeNumber(form.laborCostPerPersonDay);
  const facilityCost = genshuVolume * sanitizeNumber(form.facilityUtilityCostPerLiter);

  const liquidManufacturingCost = roundCurrency(
    riceCost +
      alcoholCost +
      otherLiquorCost +
      fruitIngredientCost +
      fruitIngredientProcessingCost +
      otherRawMaterialCost +
      laborCost +
      facilityCost
  );
  const derivedLiquidCostPerLiter = taxableVolumeLiters > 0 ? liquidManufacturingCost / taxableVolumeLiters : 0;
  const pureAlcoholLiters = genshuVolume * baseSakeAlcoholRate + rawAlcoholPure + otherLiquorPure + fruitIngredientPure;
  const estimatedAlcoholPercent = finalBlendVolumeLiters > 0 ? (pureAlcoholLiters / finalBlendVolumeLiters) * 100 : 0;

  const liquorTaxRatePerKl = getLiquorTaxRatePerKl(form.taxCategory, estimatedAlcoholPercent);
  const liquorTaxAmount = roundCurrency((liquorTaxRatePerKl / 1000) * taxableVolumeLiters);

  const lineItems = [
    createLineItem("玄米原料", "kg", brownRiceKg, form.brownRiceCostPerKg, "原酒原材料"),
    createLineItem("原料用アルコール", "L", rawAlcoholVolume, form.alcoholCostPerLiter, "配合原材料"),
    createLineItem(form.otherLiquorName || "ブレンド酒", "L", otherLiquorVolume, form.otherLiquorCostPerLiter, "配合原材料"),
    createLineItem(form.fruitIngredientName || "果汁等", "L", fruitIngredientVolume, form.fruitIngredientCostPerLiter, "配合原材料"),
    createLineItem(
      `${form.fruitIngredientName || "果汁等"}加工費`,
      "式",
      1,
      form.fruitIngredientProcessingFee,
      "固定費"
    ),
    createLineItem("その他原材料", "L", genshuVolume, form.otherRawMaterialCostPerLiter, "原酒原材料"),
    createLineItem("人件費", "人日", laborPersonDays, form.laborCostPerPersonDay, "製造経費"),
    createLineItem("設備・ユーティリティ費", "L", genshuVolume, form.facilityUtilityCostPerLiter, "製造経費"),
    createLineItem("酒税", "kl", taxableVolumeLiters / 1000, liquorTaxRatePerKl, "税金"),
    createLineItem(withPackagingLabel("瓶", appliedPackaging), "本", bottleCount, appliedPackaging.rates.bottleCostPerBottle, "包装・出荷"),
    createLineItem(withPackagingLabel("キャップ・栓", appliedPackaging), "本", bottleCount, appliedPackaging.rates.capCostPerBottle, "包装・出荷"),
    createLineItem(withPackagingLabel("ラベル", appliedPackaging), "本", bottleCount, appliedPackaging.rates.labelCostPerBottle, "包装・出荷"),
    createLineItem(withPackagingLabel("箱・梱包", appliedPackaging), "本", bottleCount, appliedPackaging.rates.cartonCostPerBottle, "包装・出荷"),
    createLineItem(withPackagingLabel("充填・火入れ", appliedPackaging), "本", bottleCount, appliedPackaging.rates.fillingCostPerBottle, "包装・出荷"),
    createLineItem(withPackagingLabel("品質検査", appliedPackaging), "本", bottleCount, appliedPackaging.rates.qaCostPerBottle, "包装・出荷"),
    createLineItem(withPackagingLabel("保管・物流", appliedPackaging), "本", bottleCount, appliedPackaging.rates.logisticsCostPerBottle, "包装・出荷"),
    createLineItem("試作・レシピ調整", "式", 1, form.developmentFee, "固定費"),
    createLineItem("表示・デザイン調整", "式", 1, form.designFee, "固定費"),
    createLineItem("進行管理・申請対応", "式", 1, form.adminFee, "固定費"),
    createLineItem(form.miscFeeLabel || "その他費用", "式", 1, form.miscFee, "固定費")
  ].filter((item) => item.total > 0);

  const costSubtotal = roundCurrency(lineItems.reduce((sum, item) => sum + item.total, 0));
  const marginAmount = roundCurrency(costSubtotal * (sanitizeNumber(form.marginRate) / 100));
  const quoteSubtotal = costSubtotal + marginAmount;
  const taxAmount = roundCurrency(quoteSubtotal * (sanitizeNumber(form.taxRate) / 100));
  const quoteTotal = quoteSubtotal + taxAmount;
  const unitPricePerBottle = bottleCount > 0 ? roundCurrency(quoteSubtotal / bottleCount) : 0;

  lineItems.push({
    label: "利益",
    unit: "%",
    quantity: roundQuantity(sanitizeNumber(form.marginRate)),
    unitPrice: 0,
    total: marginAmount,
    category: "利益"
  });

  const assumptions = [
    `酒類区分は ${categoryLabels[form.taxCategory] ?? "リキュール"} として酒税を算定。税率は ${formatCurrency(liquorTaxRatePerKl)} / kl。`,
    `出荷予定量 ${formatQuantity(roundQuantity(requestedShipmentVolumeLiters))} L に対し、歩留まりロス ${formatQuantity(cappedLossRate)}% を見込んで製造必要量 ${formatQuantity(roundQuantity(productionVolumeLiters))} L を算定しています。`,
    `純アルコール寄与率は 原酒 ${formatQuantity(contributionSeed.genshu)}%、原料用アルコール ${formatQuantity(contributionSeed.rawAlcohol)}%、${form.otherLiquorName || "ブレンド酒"} ${formatQuantity(contributionSeed.otherLiquor)}% として正規化しています。`,
    `目標度数 ${formatQuantity(targetAlcoholPercent)}% に対し、必要原酒量は ${formatQuantity(roundQuantity(genshuVolume))} L、加水量は ${formatQuantity(roundQuantity(dilutionWaterVolume))} L。`,
    `原料用アルコール ${formatQuantity(roundQuantity(rawAlcoholVolume))} L、${form.otherLiquorName || "ブレンド酒"} ${formatQuantity(roundQuantity(otherLiquorVolume))} L、${form.fruitIngredientName || "果汁等"} ${formatQuantity(roundQuantity(fruitIngredientVolume))} L を配合。`,
    `${form.fruitIngredientName || "果汁等"} の仕入単価 ${formatCurrency(sanitizeNumber(form.fruitIngredientCostPerLiter))} / L、加工費 ${formatCurrency(sanitizeNumber(form.fruitIngredientProcessingFee))} を固定費として算定。`,
    `出荷想定本数 ${formatQuantity(bottleCount)} 本、出荷量 ${formatQuantity(roundQuantity(orderedVolumeLiters))} L、想定ロット数 ${formatQuantity(roundQuantity(lotCount))} ロット。`,
    `${formatQuantity(bottleSizeMl)}ml は ${appliedPackaging.label} の包装単価を使用しています。`,
    `白米使用量 ${formatQuantity(roundQuantity(whiteRiceKg))} kg、玄米調達量 ${formatQuantity(roundQuantity(brownRiceKg))} kg、麹米 ${formatQuantity(roundQuantity(kojiRiceKg))} kg、掛米 ${formatQuantity(roundQuantity(kakemaiKg))} kg。`,
    `酒液原価は ${formatCurrency(derivedLiquidCostPerLiter)} / L。ロス込みの製造原価を出荷量で割り戻しています。`,
    `醸造期間 ${formatQuantity(sanitizeNumber(form.brewingDays))} 日、人日 ${formatQuantity(roundQuantity(laborPersonDays))} で算定。`,
    `${formatQuantity(sanitizeNumber(form.taxRate))}% の消費税を加算。`
  ];

  if (preDilutionVolume > finalBlendVolumeLiters + 0.01) {
    assumptions.unshift("注意: 原酒と添加物だけで最終液量を超えています。寄与率か度数条件を見直してください。");
  }

  if (contributionSeed.genshu > 0 && baseSakeAlcoholRate <= 0) {
    assumptions.unshift("注意: 原酒の寄与率を入れていますが、原酒度数が 0% です。");
  }

  if (contributionSeed.rawAlcohol > 0 && rawAlcoholRate <= 0) {
    assumptions.unshift("注意: 原料用アルコールの寄与率を入れていますが、原料用アルコール度数が 0% です。");
  }

  if (contributionSeed.otherLiquor > 0 && otherLiquorRate <= 0) {
    assumptions.unshift(`注意: ${form.otherLiquorName || "ブレンド酒"} の寄与率を入れていますが、度数が 0% です。`);
  }

  if (shipmentGapLiters > 0.01) {
    assumptions.unshift("注意: 容量換算の端数で、出荷予定量より実際の出荷量が少なくなっています。瓶容量か出荷予定量を調整してください。");
  }

  if (Math.abs(estimatedAlcoholPercent - targetAlcoholPercent) > 0.3) {
    assumptions.unshift("注意: 推定度数が目標度数からずれています。原酒度数か寄与率を見直してください。");
  }

  if (form.leadTime) {
    assumptions.push(`納期目安: ${form.leadTime}`);
  }

  if (form.paymentTerms) {
    assumptions.push(`支払条件: ${form.paymentTerms}`);
  }

  if (form.note) {
    assumptions.push(`備考: ${form.note}`);
  }

  return {
    bottleCount,
    lotCount: roundQuantity(lotCount),
    orderedVolumeLiters: roundQuantity(orderedVolumeLiters),
    requiredVolumeLiters: roundQuantity(productionVolumeLiters),
    plannedBrewVolumeLiters: roundQuantity(requestedShipmentVolumeLiters),
    productionVolumeLiters: roundQuantity(productionVolumeLiters),
    lossVolumeLiters: roundQuantity(lossVolumeLiters),
    genshuVolume: roundQuantity(genshuVolume),
    dilutionWaterVolume: roundQuantity(dilutionWaterVolume),
    whiteRiceKg: roundQuantity(whiteRiceKg),
    brownRiceKg: roundQuantity(brownRiceKg),
    kojiRiceKg: roundQuantity(kojiRiceKg),
    kakemaiKg: roundQuantity(kakemaiKg),
    rawAlcoholVolume: roundQuantity(rawAlcoholVolume),
    otherLiquorVolume: roundQuantity(otherLiquorVolume),
    fruitIngredientVolume: roundQuantity(fruitIngredientVolume),
    laborPersonDays: roundQuantity(laborPersonDays),
    estimatedAlcoholPercent: roundQuantity(estimatedAlcoholPercent),
    productionGapLiters: roundQuantity(shipmentGapLiters),
    liquidManufacturingCost,
    liquorTaxRatePerKl: roundCurrency(liquorTaxRatePerKl),
    liquorTaxAmount,
    derivedLiquidCostPerLiter: roundCurrency(derivedLiquidCostPerLiter),
    appliedPackagingLabel: appliedPackaging.label,
    appliedPackagingUsesBand: appliedPackaging.usesBand,
    costSubtotal,
    marginAmount,
    quoteSubtotal,
    taxAmount,
    quoteTotal,
    unitPricePerBottle,
    lineItems,
    assumptions
  };
}

function loadForm() {
  const defaults = createDefaultForm();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return defaults;
    }

    const parsed = JSON.parse(saved);
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

function saveForm(form) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
}

function loadSavedQuotes() {
  try {
    const raw = localStorage.getItem(SAVED_QUOTES_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSavedQuotes(savedQuotes) {
  localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(savedQuotes));
}

const formState = loadForm();
let savedQuotesState = loadSavedQuotes();

function createSnapshotName(form) {
  const parts = [form.clientName, form.productName, form.quoteNumber].filter(Boolean);
  return parts.length > 0 ? parts.join(" / ") : `見積保存 ${todayString()}`;
}

function syncInputs() {
  document.querySelectorAll("[data-field]").forEach((element) => {
    const field = element.dataset.field;
    element.value = formState[field] ?? "";
  });
}

function applyFormSnapshot(snapshot) {
  const defaults = createDefaultForm();
  Object.keys(defaults).forEach((key) => {
    formState[key] = snapshot[key] ?? defaults[key];
  });
  saveForm(formState);
  syncInputs();
  const saveNameInput = document.getElementById("save-name");
  if (saveNameInput) {
    saveNameInput.value = "";
  }
  render();
}

function renderLineItems(lineItems) {
  const tbody = document.getElementById("line-items-body");
  tbody.innerHTML = lineItems
    .map((item) => {
      const unitPriceCell = item.category === "利益" ? "-" : formatCurrency(item.unitPrice);
      return `
        <tr>
          <td>${escapeHtml(item.label)}</td>
          <td>${escapeHtml(formatQuantity(item.quantity))} ${escapeHtml(item.unit)}</td>
          <td>${unitPriceCell}</td>
          <td>${formatCurrency(item.total)}</td>
          <td>${escapeHtml(item.category)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderAssumptions(assumptions) {
  const container = document.getElementById("assumptions-list");
  container.innerHTML = assumptions
    .map((item) => `<div class="note-card"><p class="muted">${escapeHtml(item)}</p></div>`)
    .join("");
}

function renderSavedQuotes() {
  const container = document.getElementById("saved-quotes-list");
  const status = document.getElementById("save-status");

  if (savedQuotesState.length === 0) {
    container.innerHTML = `<div class="saved-quote-empty">保存済み見積はまだありません。必要な条件を入れたら「保存」で残せます。</div>`;
    status.textContent = "保存履歴はまだありません。";
    return;
  }

  status.textContent = `${savedQuotesState.length}件の保存済み見積があります。`;
  container.innerHTML = savedQuotesState
    .map((entry) => {
      const summary = entry.summary ?? {};
      return `
        <article class="saved-quote-card">
          <div class="saved-quote-head">
            <p class="saved-quote-title">${escapeHtml(entry.name)}</p>
            <span class="muted">${escapeHtml(formatDateTime(entry.savedAt))}</span>
          </div>
          <div class="saved-quote-meta">
            <span>${escapeHtml(entry.form?.clientName || "-")}</span>
            <span>${escapeHtml(entry.form?.productName || "-")}</span>
            <span>${escapeHtml(entry.form?.quoteNumber || "-")}</span>
          </div>
          <div class="saved-quote-meta">
            <span>税込 ${escapeHtml(formatCurrency(summary.quoteTotal ?? 0))}</span>
            <span>出荷量 ${escapeHtml(formatQuantity(summary.plannedBrewVolumeLiters ?? 0))} L</span>
            <span>${escapeHtml(formatQuantity(entry.form?.bottleSizeMl ?? 0))} ml</span>
          </div>
          <div class="saved-quote-actions">
            <button class="button" data-saved-action="load" data-saved-id="${escapeHtml(entry.id)}">読み込む</button>
            <button class="secondary-button" data-saved-action="delete" data-saved-id="${escapeHtml(entry.id)}">削除</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function render() {
  const result = calculateQuote(formState);
  formState.lotCount = result.lotCount;

  document.getElementById("summary-total").textContent = formatCurrency(result.quoteTotal);
  document.getElementById("summary-liquor-tax").textContent = formatCurrency(result.liquorTaxAmount);
  document.getElementById("summary-unit-bottle").textContent = formatCurrency(result.unitPricePerBottle);
  document.getElementById("summary-liquid-unit-cost").textContent = formatCurrency(result.derivedLiquidCostPerLiter);
  document.getElementById("summary-brew-volume").textContent = `${formatQuantity(result.plannedBrewVolumeLiters)} L`;
  document.getElementById("summary-alcohol-percent").textContent = `${formatQuantity(sanitizeNumber(formState.targetAlcoholPercent))}% / ${formatQuantity(result.estimatedAlcoholPercent)}%`;

  document.getElementById("calc-production-volume").textContent = `${formatQuantity(result.productionVolumeLiters)} L`;
  document.getElementById("calc-genshu-volume").textContent = `${formatQuantity(result.genshuVolume)} L`;
  document.getElementById("calc-water-volume").textContent = `${formatQuantity(result.dilutionWaterVolume)} L`;
  document.getElementById("calc-bottle-count").textContent = `${formatQuantity(result.bottleCount)} 本`;
  document.getElementById("calc-tax-rate").textContent = `${formatCurrency(result.liquorTaxRatePerKl)} / kl`;
  document.getElementById("calc-tax-amount").textContent = formatCurrency(result.liquorTaxAmount);
  document.getElementById("calc-estimated-abv").textContent = `${formatQuantity(result.estimatedAlcoholPercent)}%`;

  document.getElementById("preview-client").textContent = formState.clientName || "-";
  document.getElementById("preview-number").textContent = formState.quoteNumber || "-";
  document.getElementById("preview-project").textContent = formState.projectName || "案件名未入力";
  document.getElementById("preview-product").textContent =
    `${formState.productName || "製品名未入力"} / ${formState.sakeType || "酒質未入力"} / ${categoryLabels[formState.taxCategory] ?? "リキュール"}`;
  document.getElementById("active-packaging-band").textContent =
    `適用容量帯: ${result.appliedPackagingLabel}${result.appliedPackagingUsesBand ? "" : "（共通単価を使用）"}`;
  document.getElementById("packaging-rate-mode").textContent = result.appliedPackagingUsesBand
    ? `現在は ${result.appliedPackagingLabel} が適用中です。下の共通単価は見積内訳に反映されません。`
    : "現在は共通単価が見積内訳に反映されています。容量帯を設定すると自動で切り替わります。";
  document.querySelectorAll("[data-fallback-packaging='true']").forEach((element) => {
    element.disabled = result.appliedPackagingUsesBand;
  });
  document.getElementById("preview-liquid-manufacturing-cost").textContent = formatCurrency(result.liquidManufacturingCost);
  document.getElementById("preview-liquor-tax").textContent = formatCurrency(result.liquorTaxAmount);
  document.getElementById("preview-cost-subtotal").textContent = formatCurrency(result.costSubtotal);
  document.getElementById("preview-margin-amount").textContent = formatCurrency(result.marginAmount);
  document.getElementById("preview-quote-subtotal").textContent = formatCurrency(result.quoteSubtotal);
  document.getElementById("preview-tax-amount").textContent = formatCurrency(result.taxAmount);
  document.getElementById("preview-total").textContent = formatCurrency(result.quoteTotal);

  document.getElementById("tag-bottle-count").textContent = `総本数 ${formatQuantity(result.bottleCount)} 本`;
  document.getElementById("tag-lot-count").textContent = `想定ロット数 ${formatQuantity(result.lotCount)}`;
  document.getElementById("tag-production-volume").textContent = `製造必要量 ${formatQuantity(result.productionVolumeLiters)} L`;
  document.getElementById("tag-genshu-volume").textContent = `原酒量 ${formatQuantity(result.genshuVolume)} L`;
  document.getElementById("tag-water-volume").textContent = `加水量 ${formatQuantity(result.dilutionWaterVolume)} L`;
  document.getElementById("tag-brew-volume").textContent = `出荷予定量 ${formatQuantity(result.plannedBrewVolumeLiters)} L`;
  document.getElementById("tag-loss-volume").textContent = `ロス見込 ${formatQuantity(result.lossVolumeLiters)} L`;
  document.getElementById("tag-tax-category").textContent = `酒類区分 ${categoryLabels[formState.taxCategory] ?? "-"}`;
  document.getElementById("tag-liquid-unit-cost").textContent = `酒液原価 ${formatCurrency(result.derivedLiquidCostPerLiter)} / L`;
  document.getElementById("tag-unit-bottle").textContent = `税抜単価 ${formatCurrency(result.unitPricePerBottle)} / 本`;
  document.getElementById("tag-white-rice").textContent = `白米使用量 ${formatQuantity(result.whiteRiceKg)} kg`;
  document.getElementById("tag-person-days").textContent = `人日 ${formatQuantity(result.laborPersonDays)}`;
  document.getElementById("tag-alcohol-percent").textContent = `推定度数 ${formatQuantity(result.estimatedAlcoholPercent)}%`;
  document.getElementById("tag-liquor-tax").textContent = `酒税 ${formatCurrency(result.liquorTaxAmount)}`;
  document.querySelector('[data-field="lotCount"]').value = result.lotCount;

  renderLineItems(result.lineItems);
  renderAssumptions(result.assumptions);
  renderSavedQuotes();

  return result;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function exportCsv() {
  const result = calculateQuote(formState);
  const lines = [
    ["field", "value"].join(","),
    ["quote_number", csvCell(formState.quoteNumber)],
    ["issued_on", csvCell(formState.issuedOn)],
    ["client_name", csvCell(formState.clientName)],
    ["project_name", csvCell(formState.projectName)],
    ["product_name", csvCell(formState.productName)],
    ["sake_type", csvCell(formState.sakeType)],
    ["tax_category", csvCell(categoryLabels[formState.taxCategory] ?? formState.taxCategory)],
    ["target_alcohol_percent", formState.targetAlcoholPercent],
    ["bottle_count", result.bottleCount],
    ["lot_count", result.lotCount],
    ["planned_brew_volume_liters", result.plannedBrewVolumeLiters],
    ["production_volume_liters", result.productionVolumeLiters],
    ["loss_volume_liters", result.lossVolumeLiters],
    ["applied_packaging_band", csvCell(result.appliedPackagingLabel)],
    ["genshu_contribution_percent", formState.genshuContributionPercent],
    ["raw_alcohol_contribution_percent", formState.alcoholContributionPercent],
    ["other_liquor_contribution_percent", formState.otherLiquorContributionPercent],
    ["genshu_volume_liters", result.genshuVolume],
    ["dilution_water_volume_liters", result.dilutionWaterVolume],
    ["raw_alcohol_volume_liters", result.rawAlcoholVolume],
    ["other_liquor_volume_liters", result.otherLiquorVolume],
    ["fruit_ingredient_volume_liters", result.fruitIngredientVolume],
    ["fruit_ingredient_processing_fee", formState.fruitIngredientProcessingFee],
    ["estimated_alcohol_percent", result.estimatedAlcoholPercent],
    ["liquor_tax_rate_per_kl", result.liquorTaxRatePerKl],
    ["liquor_tax_amount", result.liquorTaxAmount],
    ["white_rice_kg", result.whiteRiceKg],
    ["brown_rice_kg", result.brownRiceKg],
    ["labor_person_days", result.laborPersonDays],
    ["derived_liquid_cost_per_liter", result.derivedLiquidCostPerLiter],
    ["quote_subtotal", result.quoteSubtotal],
    ["tax_amount", result.taxAmount],
    ["quote_total", result.quoteTotal],
    "",
    ["line_item", "unit", "quantity", "unit_price", "total", "category"].join(","),
    ...result.lineItems.map((item) =>
      [csvCell(item.label), item.unit, item.quantity, item.unitPrice, item.total, csvCell(item.category)].join(",")
    )
  ];

  const blob = new Blob([`\uFEFF${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${formState.quoteNumber || "oem-quote"}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function resetForm() {
  const defaults = createDefaultForm();
  Object.keys(defaults).forEach((key) => {
    formState[key] = defaults[key];
  });
  saveForm(formState);
  syncInputs();
  render();
}

function saveCurrentQuote() {
  const saveNameInput = document.getElementById("save-name");
  const rawName = saveNameInput.value.trim();
  const name = rawName || createSnapshotName(formState);
  const result = calculateQuote(formState);
  const snapshot = {
    id: createId(),
    name,
    savedAt: new Date().toISOString(),
    form: { ...formState },
    summary: {
      quoteTotal: result.quoteTotal,
      plannedBrewVolumeLiters: result.plannedBrewVolumeLiters
    }
  };

  savedQuotesState = [snapshot, ...savedQuotesState].slice(0, 30);
  saveSavedQuotes(savedQuotesState);
  saveNameInput.value = "";
  renderSavedQuotes();
}

document.addEventListener("input", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
    return;
  }

  const field = target.dataset.field;
  if (!field) {
    return;
  }

  formState[field] = numericFields.has(field) ? sanitizeNumber(Number(target.value)) : target.value.trim();
  saveForm(formState);
  render();
});

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const savedAction = target.dataset.savedAction;
  const savedId = target.dataset.savedId;

  if (!savedAction || !savedId) {
    return;
  }

  const targetQuote = savedQuotesState.find((entry) => entry.id === savedId);
  if (!targetQuote) {
    return;
  }

  if (savedAction === "load") {
    applyFormSnapshot(targetQuote.form);
    return;
  }

  if (savedAction === "delete") {
    savedQuotesState = savedQuotesState.filter((entry) => entry.id !== savedId);
    saveSavedQuotes(savedQuotesState);
    renderSavedQuotes();
  }
});

document.getElementById("save-quote").addEventListener("click", saveCurrentQuote);
document.getElementById("save-quote-secondary").addEventListener("click", saveCurrentQuote);
document.getElementById("download-csv").addEventListener("click", exportCsv);
document.getElementById("print-quote").addEventListener("click", () => window.print());
document.getElementById("reset-form").addEventListener("click", resetForm);

syncInputs();
render();
