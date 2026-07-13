import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { buildClaimEmail } from "./build-claim-email";

interface DownloadClaimPdfInput {
  fullName: string;
  sponsorName: string;
  sponsorReward: string;
  brandUrl?: string;
}

function createEmailRenderNode(htmlContent: string): HTMLDivElement {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-10000px";
  host.style.top = "0";
  host.style.width = "600px";
  host.style.background = "#ffffff";
  host.style.zIndex = "-1";
  host.setAttribute("aria-hidden", "true");

  const card = document.createElement("div");
  card.style.width = "600px";
  card.style.boxSizing = "border-box";
  card.style.background = "#ffffff";
  card.innerHTML = htmlContent.trim();
  host.appendChild(card);
  document.body.appendChild(host);
  return host;
}

export async function downloadClaimPdf(input: DownloadClaimPdfInput): Promise<void> {
  const { htmlContent } = buildClaimEmail(input);
  const host = createEmailRenderNode(htmlContent);
  const target = host.firstElementChild as HTMLElement;

  try {
    const canvas = await html2canvas(target, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 600,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 24;
    const usableWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * usableWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, "PNG", margin, position, usableWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
      position = margin - (imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, position, usableWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    const safeName = input.sponsorName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    pdf.save(`publipack-reward-${safeName || "prize"}.pdf`);
  } finally {
    host.remove();
  }
}
