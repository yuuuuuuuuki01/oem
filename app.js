const STORAGE_KEY = "sake-oem-quote-form-v3";

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
  "alcoholAdditionPercent",
  "alcoholCostPerLiter",
  "alcoholStrengthPercent",
  "otherLiquorBlendPercent",
  "otherLiquorCostPerLiter",
  "otherLiquorAlcoholPercent",
  "fruitIngredientBlendPercent",
  "fruitIngredientCostPerLiter",
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

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function defaultQuoteNumber() {
  return `OEM-${todayString().replaceAll("-", "")}-001`;
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
    alcoholAdditionPercent: 5,
    alcoholCostPerLiter: 215,
    alcoholStrengthPercent: 95,
    otherLiquorName: "ブレンド酒",
    otherLiquorBlendPercent: 5,
    otherLiquorCostPerLiter: 280,
    otherLiquorAlcoholPercent: 12,
    fruitIngredientName: "果汁等",
    fruitIngredientBlendPercent: 8,
    fruitIngredientCostPerLiter: 340,
    fruitIngredientAlcoholPercent: 0,
    otherRawMaterialCostPerLiter: 36,
    brewingDays: 28,
    staffCount: 3,
    laborCostPerPersonDay: 18000,
    facilityUtilityCostPerLiter: 45,
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
  const finalBlendVolumeLiters = sanitizeNumber(form.plannedBrewVolumeLiters);
  const targetAlcoholPercent = sanitizeNumber(form.targetAlcoholPercent);
  const targetAlcoholLiters = finalBlendVolumeLiters * (targetAlcoholPercent / 100);

  const rawAlcoholVolume = finalBlendVolumeLiters * (sanitizeNumber(form.alcoholAdditionPercent) / 100);
  const otherLiquorVolume = finalBlendVolumeLiters * (sanitizeNumber(form.otherLiquorBlendPercent) / 100);
  const fruitIngredientVolume = finalBlendVolumeLiters * (sanitizeNumber(form.fruitIngredientBlendPercent) / 100);

  const rawAlcoholPure = rawAlcoholVolume * (sanitizeNumber(form.alcoholStrengthPercent) / 100);
  const otherLiquorPure = otherLiquorVolume * (sanitizeNumber(form.otherLiquorAlcoholPercent) / 100);
  const fruitIngredientPure = fruitIngredientVolume * (sanitizeNumber(form.fruitIngredientAlcoholPercent) / 100);
  const baseSakeAlcoholRate = sanitizeNumber(form.baseSakeAlcoholPercent) / 100;

  const remainingAlcoholForGenshu = Math.max(targetAlcoholLiters - rawAlcoholPure - otherLiquorPure - fruitIngredientPure, 0);
  const genshuVolume = baseSakeAlcoholRate > 0 ? remainingAlcoholForGenshu / baseSakeAlcoholRate : 0;
  const dilutionWaterVolume = Math.max(finalBlendVolumeLiters - genshuVolume - rawAlcoholVolume - otherLiquorVolume - fruitIngredientVolume, 0);
  const preDilutionVolume = genshuVolume + rawAlcoholVolume + otherLiquorVolume + fruitIngredientVolume;

  const cappedLossRate = Math.min(sanitizeNumber(form.expectedLossRate), 95);
  const yieldRate = 1 - cappedLossRate / 100;
  const bottlableVolumeLiters = finalBlendVolumeLiters * yieldRate;
  const bottleSizeMl = sanitizeNumber(form.bottleSizeMl);
  const bottleCount = bottleSizeMl > 0 ? Math.floor((bottlableVolumeLiters * 1000) / bottleSizeMl) : 0;
  const orderedVolumeLiters = (bottleCount * bottleSizeMl) / 1000;
  const lotCount = sanitizeNumber(form.bottlesPerLot) > 0 ? bottleCount / sanitizeNumber(form.bottlesPerLot) : 0;
  const requiredVolumeLiters = yieldRate > 0 ? orderedVolumeLiters / yieldRate : orderedVolumeLiters;
  const productionGapLiters = finalBlendVolumeLiters - requiredVolumeLiters;

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
  const otherRawMaterialCost = genshuVolume * sanitizeNumber(form.otherRawMaterialCostPerLiter);
  const laborCost = laborPersonDays * sanitizeNumber(form.laborCostPerPersonDay);
  const facilityCost = genshuVolume * sanitizeNumber(form.facilityUtilityCostPerLiter);

  const liquidManufacturingCost = roundCurrency(
    riceCost + alcoholCost + otherLiquorCost + fruitIngredientCost + otherRawMaterialCost + laborCost + facilityCost
  );
  const derivedLiquidCostPerLiter = finalBlendVolumeLiters > 0 ? liquidManufacturingCost / finalBlendVolumeLiters : 0;
  const pureAlcoholLiters = genshuVolume * baseSakeAlcoholRate + rawAlcoholPure + otherLiquorPure + fruitIngredientPure;
  const estimatedAlcoholPercent = finalBlendVolumeLiters > 0 ? (pureAlcoholLiters / finalBlendVolumeLiters) * 100 : 0;

  const liquorTaxRatePerKl = getLiquorTaxRatePerKl(form.taxCategory, estimatedAlcoholPercent);
  const liquorTaxAmount = roundCurrency((liquorTaxRatePerKl / 1000) * finalBlendVolumeLiters);

  const lineItems = [
    createLineItem("玄米原料", "kg", brownRiceKg, form.brownRiceCostPerKg, "原酒原材料"),
    createLineItem("原料用アルコール", "L", rawAlcoholVolume, form.alcoholCostPerLiter, "配合原材料"),
    createLineItem(form.otherLiquorName || "ブレンド酒", "L", otherLiquorVolume, form.otherLiquorCostPerLiter, "配合原材料"),
    createLineItem(form.fruitIngredientName || "果汁等", "L", fruitIngredientVolume, form.fruitIngredientCostPerLiter, "配合原材料"),
    createLineItem("その他原材料", "L", genshuVolume, form.otherRawMaterialCostPerLiter, "原酒原材料"),
    createLineItem("人件費", "人日", laborPersonDays, form.laborCostPerPersonDay, "製造経費"),
    createLineItem("設備・ユーティリティ費", "L", genshuVolume, form.facilityUtilityCostPerLiter, "製造経費"),
    createLineItem("酒税", "kl", finalBlendVolumeLiters / 1000, liquorTaxRatePerKl, "税金"),
    createLineItem("瓶", "本", bottleCount, form.bottleCostPerBottle, "包装・出荷"),
    createLineItem("キャップ・栓", "本", bottleCount, form.capCostPerBottle, "包装・出荷"),
    createLineItem("ラベル", "本", bottleCount, form.labelCostPerBottle, "包装・出荷"),
    createLineItem("箱・梱包", "本", bottleCount, form.cartonCostPerBottle, "包装・出荷"),
    createLineItem("充填・火入れ", "本", bottleCount, form.fillingCostPerBottle, "包装・出荷"),
    createLineItem("品質検査", "本", bottleCount, form.qaCostPerBottle, "包装・出荷"),
    createLineItem("保管・物流", "本", bottleCount, form.logisticsCostPerBottle, "包装・出荷"),
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
    `仕込み予定量 ${formatQuantity(roundQuantity(finalBlendVolumeLiters))} L は加水後の最終液量として扱っています。`,
    `目標度数 ${formatQuantity(targetAlcoholPercent)}% に対し、必要原酒量は ${formatQuantity(roundQuantity(genshuVolume))} L、加水量は ${formatQuantity(roundQuantity(dilutionWaterVolume))} L。`,
    `原料用アルコール ${formatQuantity(roundQuantity(rawAlcoholVolume))} L、${form.otherLiquorName || "ブレンド酒"} ${formatQuantity(roundQuantity(otherLiquorVolume))} L、${form.fruitIngredientName || "果汁等"} ${formatQuantity(roundQuantity(fruitIngredientVolume))} L を配合。`,
    `瓶詰可能本数 ${formatQuantity(bottleCount)} 本、想定ロット数 ${formatQuantity(roundQuantity(lotCount))} ロット。`,
    `白米使用量 ${formatQuantity(roundQuantity(whiteRiceKg))} kg、玄米調達量 ${formatQuantity(roundQuantity(brownRiceKg))} kg、麹米 ${formatQuantity(roundQuantity(kojiRiceKg))} kg、掛米 ${formatQuantity(roundQuantity(kakemaiKg))} kg。`,
    `酒液原価は ${formatCurrency(derivedLiquidCostPerLiter)} / L。米や副原料の原材料費は原酒量ベースで算定しています。`,
    `醸造期間 ${formatQuantity(sanitizeNumber(form.brewingDays))} 日、人日 ${formatQuantity(roundQuantity(laborPersonDays))} で算定。`,
    `${formatQuantity(sanitizeNumber(form.taxRate))}% の消費税を加算。`
  ];

  if (preDilutionVolume > finalBlendVolumeLiters + 0.01) {
    assumptions.unshift("注意: 原酒と添加物だけで最終液量を超えています。配合比率か度数条件を見直してください。");
  }

  if (productionGapLiters < 0) {
    assumptions.unshift("注意: 仕込み予定量が歩留まり後の必要量を下回っています。");
  }

  if (Math.abs(estimatedAlcoholPercent - targetAlcoholPercent) > 0.3) {
    assumptions.unshift("注意: 推定度数が目標度数からずれています。原酒度数か配合比率を見直してください。");
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
    requiredVolumeLiters: roundQuantity(requiredVolumeLiters),
    plannedBrewVolumeLiters: roundQuantity(finalBlendVolumeLiters),
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
    productionGapLiters: roundQuantity(productionGapLiters),
    liquidManufacturingCost,
    liquorTaxRatePerKl: roundCurrency(liquorTaxRatePerKl),
    liquorTaxAmount,
    derivedLiquidCostPerLiter: roundCurrency(derivedLiquidCostPerLiter),
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

const formState = loadForm();

function syncInputs() {
  document.querySelectorAll("[data-field]").forEach((element) => {
    const field = element.dataset.field;
    element.value = formState[field] ?? "";
  });
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

function render() {
  const result = calculateQuote(formState);
  formState.lotCount = result.lotCount;

  document.getElementById("summary-total").textContent = formatCurrency(result.quoteTotal);
  document.getElementById("summary-liquor-tax").textContent = formatCurrency(result.liquorTaxAmount);
  document.getElementById("summary-unit-bottle").textContent = formatCurrency(result.unitPricePerBottle);
  document.getElementById("summary-liquid-unit-cost").textContent = formatCurrency(result.derivedLiquidCostPerLiter);
  document.getElementById("summary-brew-volume").textContent = `${formatQuantity(result.plannedBrewVolumeLiters)} L`;
  document.getElementById("summary-alcohol-percent").textContent = `${formatQuantity(sanitizeNumber(formState.targetAlcoholPercent))}% / ${formatQuantity(result.estimatedAlcoholPercent)}%`;

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
  document.getElementById("preview-liquid-manufacturing-cost").textContent = formatCurrency(result.liquidManufacturingCost);
  document.getElementById("preview-liquor-tax").textContent = formatCurrency(result.liquorTaxAmount);
  document.getElementById("preview-cost-subtotal").textContent = formatCurrency(result.costSubtotal);
  document.getElementById("preview-margin-amount").textContent = formatCurrency(result.marginAmount);
  document.getElementById("preview-quote-subtotal").textContent = formatCurrency(result.quoteSubtotal);
  document.getElementById("preview-tax-amount").textContent = formatCurrency(result.taxAmount);
  document.getElementById("preview-total").textContent = formatCurrency(result.quoteTotal);

  document.getElementById("tag-bottle-count").textContent = `総本数 ${formatQuantity(result.bottleCount)} 本`;
  document.getElementById("tag-lot-count").textContent = `想定ロット数 ${formatQuantity(result.lotCount)}`;
  document.getElementById("tag-genshu-volume").textContent = `原酒量 ${formatQuantity(result.genshuVolume)} L`;
  document.getElementById("tag-water-volume").textContent = `加水量 ${formatQuantity(result.dilutionWaterVolume)} L`;
  document.getElementById("tag-brew-volume").textContent = `仕込み予定量 ${formatQuantity(result.plannedBrewVolumeLiters)} L`;
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
    ["genshu_volume_liters", result.genshuVolume],
    ["dilution_water_volume_liters", result.dilutionWaterVolume],
    ["raw_alcohol_volume_liters", result.rawAlcoholVolume],
    ["other_liquor_volume_liters", result.otherLiquorVolume],
    ["fruit_ingredient_volume_liters", result.fruitIngredientVolume],
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

document.getElementById("download-csv").addEventListener("click", exportCsv);
document.getElementById("print-quote").addEventListener("click", () => window.print());
document.getElementById("reset-form").addEventListener("click", resetForm);

syncInputs();
render();
