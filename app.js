const STORAGE_KEY = "sake-oem-quote-form-v2";

const numericFields = new Set([
  "bottleSizeMl",
  "bottlesPerLot",
  "lotCount",
  "expectedLossRate",
  "targetAlcoholPercent",
  "plannedBrewVolumeLiters",
  "brownRiceCostPerKg",
  "ricePolishingRatio",
  "litersPerKgWhiteRice",
  "kojiRatioPercent",
  "baseSakeAlcoholPercent",
  "alcoholAdditionRate",
  "alcoholCostPerLiter",
  "alcoholStrengthPercent",
  "otherLiquorAdditionRate",
  "otherLiquorCostPerLiter",
  "otherLiquorAlcoholPercent",
  "otherIngredientCostPerLiter",
  "brewingDays",
  "staffCount",
  "laborCostPerPersonDay",
  "facilityCostPerDay",
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
    projectName: "2026年秋冬向け OEM 純米吟醸",
    productName: "純米吟醸 OEM",
    sakeType: "純米吟醸",
    targetAlcoholPercent: 15,
    bottleSizeMl: 720,
    bottlesPerLot: 1200,
    lotCount: 3,
    expectedLossRate: 3,
    plannedBrewVolumeLiters: 2700,
    brownRiceCostPerKg: 420,
    ricePolishingRatio: 60,
    litersPerKgWhiteRice: 2.25,
    kojiRatioPercent: 22,
    baseSakeAlcoholPercent: 17,
    alcoholAdditionRate: 0.08,
    alcoholCostPerLiter: 215,
    alcoholStrengthPercent: 95,
    otherLiquorName: "ブレンド酒",
    otherLiquorAdditionRate: 0.04,
    otherLiquorCostPerLiter: 280,
    otherLiquorAlcoholPercent: 12,
    otherIngredientCostPerLiter: 36,
    brewingDays: 28,
    staffCount: 3,
    laborCostPerPersonDay: 18000,
    facilityCostPerDay: 32000,
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
    miscFeeLabel: "酒税・申請補助",
    miscFee: 30000,
    marginRate: 22,
    taxRate: 10,
    leadTime: "正式発注後 45 日",
    paymentTerms: "納品月末締め翌月末払い",
    note: "ラベルデザイン支給、一括納品、常温保管を前提とした試算です。"
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

function calculateQuote(form) {
  const bottleCount = Math.round(sanitizeNumber(form.bottlesPerLot) * sanitizeNumber(form.lotCount));
  const orderedVolumeLiters = (bottleCount * sanitizeNumber(form.bottleSizeMl)) / 1000;
  const cappedLossRate = Math.min(sanitizeNumber(form.expectedLossRate), 95);
  const yieldRate = 1 - cappedLossRate / 100;
  const requiredVolumeLiters = yieldRate > 0 ? orderedVolumeLiters / yieldRate : orderedVolumeLiters;
  const plannedBrewVolumeLiters = sanitizeNumber(form.plannedBrewVolumeLiters) || requiredVolumeLiters;
  const rawAlcoholVolume = plannedBrewVolumeLiters * sanitizeNumber(form.alcoholAdditionRate);
  const otherLiquorVolume = plannedBrewVolumeLiters * sanitizeNumber(form.otherLiquorAdditionRate);
  const sakeBaseVolume = Math.max(plannedBrewVolumeLiters - rawAlcoholVolume - otherLiquorVolume, 0);

  const litersPerKgWhiteRice = sanitizeNumber(form.litersPerKgWhiteRice);
  const whiteRiceKg = litersPerKgWhiteRice > 0 ? sakeBaseVolume / litersPerKgWhiteRice : 0;
  const polishingRatio = Math.min(Math.max(sanitizeNumber(form.ricePolishingRatio), 1), 100) / 100;
  const brownRiceKg = whiteRiceKg / polishingRatio;
  const kojiRatio = sanitizeNumber(form.kojiRatioPercent) / 100;
  const kojiRiceKg = whiteRiceKg * kojiRatio;
  const kakemaiKg = Math.max(whiteRiceKg - kojiRiceKg, 0);
  const laborPersonDays = sanitizeNumber(form.brewingDays) * sanitizeNumber(form.staffCount);

  const riceCost = brownRiceKg * sanitizeNumber(form.brownRiceCostPerKg);
  const alcoholCost = rawAlcoholVolume * sanitizeNumber(form.alcoholCostPerLiter);
  const otherLiquorCost = otherLiquorVolume * sanitizeNumber(form.otherLiquorCostPerLiter);
  const otherIngredientCost = plannedBrewVolumeLiters * sanitizeNumber(form.otherIngredientCostPerLiter);
  const laborCost = laborPersonDays * sanitizeNumber(form.laborCostPerPersonDay);
  const facilityCost = sanitizeNumber(form.brewingDays) * sanitizeNumber(form.facilityCostPerDay);
  const liquidManufacturingCost = roundCurrency(riceCost + alcoholCost + otherLiquorCost + otherIngredientCost + laborCost + facilityCost);
  const derivedLiquidCostPerLiter = plannedBrewVolumeLiters > 0 ? liquidManufacturingCost / plannedBrewVolumeLiters : 0;
  const pureAlcoholLiters =
    sakeBaseVolume * (sanitizeNumber(form.baseSakeAlcoholPercent) / 100) +
    rawAlcoholVolume * (sanitizeNumber(form.alcoholStrengthPercent) / 100) +
    otherLiquorVolume * (sanitizeNumber(form.otherLiquorAlcoholPercent) / 100);
  const estimatedAlcoholPercent = plannedBrewVolumeLiters > 0 ? (pureAlcoholLiters / plannedBrewVolumeLiters) * 100 : 0;
  const productionGapLiters = plannedBrewVolumeLiters - requiredVolumeLiters;

  const lineItems = [
    createLineItem("玄米原料", "kg", brownRiceKg, form.brownRiceCostPerKg, "酒液製造"),
    createLineItem("原料用アルコール", "L", rawAlcoholVolume, form.alcoholCostPerLiter, "酒液製造"),
    createLineItem(form.otherLiquorName || "ブレンド酒", "L", otherLiquorVolume, form.otherLiquorCostPerLiter, "酒液製造"),
    createLineItem("その他副資材", "L", plannedBrewVolumeLiters, form.otherIngredientCostPerLiter, "酒液製造"),
    createLineItem("人件費", "人日", laborPersonDays, form.laborCostPerPersonDay, "酒液製造"),
    createLineItem("設備・資材利用費", "日", form.brewingDays, form.facilityCostPerDay, "酒液製造"),
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
  const unitPricePerLiter = orderedVolumeLiters > 0 ? roundCurrency(quoteSubtotal / orderedVolumeLiters) : 0;

  lineItems.push({
    label: "利益",
    unit: "%",
    quantity: roundQuantity(sanitizeNumber(form.marginRate)),
    unitPrice: 0,
    total: marginAmount,
    category: "利益"
  });

  const assumptions = [
    `総本数 ${formatQuantity(bottleCount)} 本、容量 ${formatQuantity(sanitizeNumber(form.bottleSizeMl))} ml で計算。`,
    `必要酒液量 ${formatQuantity(roundQuantity(requiredVolumeLiters))} L に対して、仕込予定量は ${formatQuantity(roundQuantity(plannedBrewVolumeLiters))} L、差分は ${formatQuantity(roundQuantity(productionGapLiters))} L。`,
    `目標度数 ${formatQuantity(sanitizeNumber(form.targetAlcoholPercent))}%、推定ブレンド度数 ${formatQuantity(roundQuantity(estimatedAlcoholPercent))}%。`,
    `酒液原価は ${formatCurrency(derivedLiquidCostPerLiter)} / L。ベース酒 ${formatQuantity(roundQuantity(sakeBaseVolume))} L、原料用アルコール ${formatQuantity(roundQuantity(rawAlcoholVolume))} L、${form.otherLiquorName || "ブレンド酒"} ${formatQuantity(roundQuantity(otherLiquorVolume))} L。`,
    `白米使用量 ${formatQuantity(roundQuantity(whiteRiceKg))} kg、玄米調達量 ${formatQuantity(roundQuantity(brownRiceKg))} kg、麹米 ${formatQuantity(roundQuantity(kojiRiceKg))} kg、掛米 ${formatQuantity(roundQuantity(kakemaiKg))} kg。`,
    `醸造期間 ${formatQuantity(sanitizeNumber(form.brewingDays))} 日、人日 ${formatQuantity(roundQuantity(laborPersonDays))} で算定。`,
    `${formatQuantity(sanitizeNumber(form.taxRate))}% の消費税を加算。`
  ];

  if (productionGapLiters < 0) {
    assumptions.unshift("注意: 仕込予定量が受注必要量を下回っています。");
  }

  if (Math.abs(estimatedAlcoholPercent - sanitizeNumber(form.targetAlcoholPercent)) > 0.5) {
    assumptions.unshift("注意: 推定ブレンド度数が目標度数から 0.5pt 以上ずれています。");
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
    orderedVolumeLiters: roundQuantity(orderedVolumeLiters),
    requiredVolumeLiters: roundQuantity(requiredVolumeLiters),
    plannedBrewVolumeLiters: roundQuantity(plannedBrewVolumeLiters),
    sakeBaseVolume: roundQuantity(sakeBaseVolume),
    whiteRiceKg: roundQuantity(whiteRiceKg),
    brownRiceKg: roundQuantity(brownRiceKg),
    kojiRiceKg: roundQuantity(kojiRiceKg),
    kakemaiKg: roundQuantity(kakemaiKg),
    alcoholLiters: roundQuantity(rawAlcoholVolume),
    otherLiquorVolume: roundQuantity(otherLiquorVolume),
    laborPersonDays: roundQuantity(laborPersonDays),
    estimatedAlcoholPercent: roundQuantity(estimatedAlcoholPercent),
    productionGapLiters: roundQuantity(productionGapLiters),
    liquidManufacturingCost,
    derivedLiquidCostPerLiter: roundCurrency(derivedLiquidCostPerLiter),
    costSubtotal,
    marginAmount,
    quoteSubtotal,
    taxAmount,
    quoteTotal,
    unitPricePerBottle,
    unitPricePerLiter,
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

  document.getElementById("summary-total").textContent = formatCurrency(result.quoteTotal);
  document.getElementById("summary-unit-bottle").textContent = formatCurrency(result.unitPricePerBottle);
  document.getElementById("summary-liquid-unit-cost").textContent = formatCurrency(result.derivedLiquidCostPerLiter);
  document.getElementById("summary-brew-volume").textContent = `${formatQuantity(result.plannedBrewVolumeLiters)} L`;
  document.getElementById("summary-alcohol-percent").textContent = `${formatQuantity(sanitizeNumber(formState.targetAlcoholPercent))}% / ${formatQuantity(result.estimatedAlcoholPercent)}%`;

  document.getElementById("preview-client").textContent = formState.clientName || "-";
  document.getElementById("preview-number").textContent = formState.quoteNumber || "-";
  document.getElementById("preview-project").textContent = formState.projectName || "案件名未入力";
  document.getElementById("preview-product").textContent = `${formState.productName || "製品名未入力"} / ${formState.sakeType || "酒質未入力"} / 目標 ${formatQuantity(sanitizeNumber(formState.targetAlcoholPercent))}%`;
  document.getElementById("preview-liquid-manufacturing-cost").textContent = formatCurrency(result.liquidManufacturingCost);
  document.getElementById("preview-cost-subtotal").textContent = formatCurrency(result.costSubtotal);
  document.getElementById("preview-margin-amount").textContent = formatCurrency(result.marginAmount);
  document.getElementById("preview-quote-subtotal").textContent = formatCurrency(result.quoteSubtotal);
  document.getElementById("preview-tax-amount").textContent = formatCurrency(result.taxAmount);
  document.getElementById("preview-total").textContent = formatCurrency(result.quoteTotal);

  document.getElementById("tag-bottle-count").textContent = `総本数 ${formatQuantity(result.bottleCount)} 本`;
  document.getElementById("tag-required-volume").textContent = `必要酒液量 ${formatQuantity(result.requiredVolumeLiters)} L`;
  document.getElementById("tag-brew-volume").textContent = `仕込予定量 ${formatQuantity(result.plannedBrewVolumeLiters)} L`;
  document.getElementById("tag-liquid-unit-cost").textContent = `酒液原価 ${formatCurrency(result.derivedLiquidCostPerLiter)} / L`;
  document.getElementById("tag-unit-bottle").textContent = `税抜単価 ${formatCurrency(result.unitPricePerBottle)} / 本`;
  document.getElementById("tag-white-rice").textContent = `白米使用量 ${formatQuantity(result.whiteRiceKg)} kg`;
  document.getElementById("tag-person-days").textContent = `人日 ${formatQuantity(result.laborPersonDays)}`;
  document.getElementById("tag-alcohol-percent").textContent = `推定度数 ${formatQuantity(result.estimatedAlcoholPercent)}%`;

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
    ["target_alcohol_percent", formState.targetAlcoholPercent],
    ["bottle_count", result.bottleCount],
    ["ordered_volume_liters", result.orderedVolumeLiters],
    ["required_volume_liters", result.requiredVolumeLiters],
    ["planned_brew_volume_liters", result.plannedBrewVolumeLiters],
    ["brown_rice_cost_per_kg", formState.brownRiceCostPerKg],
    ["rice_polishing_ratio", formState.ricePolishingRatio],
    ["liters_per_kg_white_rice", formState.litersPerKgWhiteRice],
    ["koji_ratio_percent", formState.kojiRatioPercent],
    ["base_sake_alcohol_percent", formState.baseSakeAlcoholPercent],
    ["alcohol_addition_rate", formState.alcoholAdditionRate],
    ["alcohol_cost_per_liter", formState.alcoholCostPerLiter],
    ["alcohol_strength_percent", formState.alcoholStrengthPercent],
    ["other_liquor_name", csvCell(formState.otherLiquorName)],
    ["other_liquor_addition_rate", formState.otherLiquorAdditionRate],
    ["other_liquor_cost_per_liter", formState.otherLiquorCostPerLiter],
    ["other_liquor_alcohol_percent", formState.otherLiquorAlcoholPercent],
    ["other_ingredient_cost_per_liter", formState.otherIngredientCostPerLiter],
    ["brewing_days", formState.brewingDays],
    ["staff_count", formState.staffCount],
    ["labor_cost_per_person_day", formState.laborCostPerPersonDay],
    ["facility_cost_per_day", formState.facilityCostPerDay],
    ["white_rice_kg", result.whiteRiceKg],
    ["brown_rice_kg", result.brownRiceKg],
    ["alcohol_liters", result.alcoholLiters],
    ["other_liquor_volume", result.otherLiquorVolume],
    ["estimated_alcohol_percent", result.estimatedAlcoholPercent],
    ["production_gap_liters", result.productionGapLiters],
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

  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
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
