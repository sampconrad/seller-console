/**
 * PDF generation service for creating detailed reports with charts
 */

import { ReportData } from '@/types';
import { getStageChartColor, getStatusChartColor } from '@/utils/dataTransform';
import jsPDF from 'jspdf';

export class PDFService {
  /**
   * Generate a chart image as base64 string
   */
  private static generateChartImage(
    data: Array<{ value: string; label: string; count: number }>,
    type: 'lead' | 'opportunity'
  ): string {
    // Create a temporary canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Set canvas size - full width for PDF page with space for legend
    canvas.width = 1000;
    canvas.height = 500;

    // Filter and sort data
    const chartData = data
      .filter(option => option.value !== 'all')
      .sort((a, b) => b.count - a.count);

    if (chartData.length === 0) return '';

    const totalCount = chartData.reduce((sum, option) => sum + option.count, 0);
    if (totalCount === 0) return '';

    // Calculate center and radius - positioned to the left to make room for legend
    const chartAreaWidth = canvas.width * 0.6; // Use 60% of width for chart
    const centerX = chartAreaWidth / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw title
    // ctx.fillStyle = '#374151';
    // ctx.font = 'bold 20px Arial';
    // ctx.textAlign = 'center';

    // Draw doughnut chart
    let currentAngle = -Math.PI / 2; // Start from top

    chartData.forEach(option => {
      const sliceAngle = (option.count / totalCount) * 2 * Math.PI;
      const color =
        type === 'lead'
          ? getStatusChartColor(option.value)
          : getStageChartColor(option.value);

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        radius,
        currentAngle,
        currentAngle + sliceAngle
      );
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Draw border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // No labels around the chart - will be in legend instead

      currentAngle += sliceAngle;
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw total count in center
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Total', centerX, centerY - 10);
    ctx.fillText(totalCount.toString(), centerX, centerY + 15);

    // Draw legend on the right side - even bigger sizes
    const legendStartX = chartAreaWidth + 20;
    const legendStartY = 80;
    const legendItemHeight = 60;
    const legendColorSize = 28;
    const legendSpacing = 12;

    chartData.forEach((option, index) => {
      const legendY = legendStartY + index * (legendItemHeight + legendSpacing);
      const color =
        type === 'lead'
          ? getStatusChartColor(option.value)
          : getStageChartColor(option.value);

      // Draw color box
      ctx.fillStyle = color;
      ctx.fillRect(legendStartX, legendY, legendColorSize, legendColorSize);

      // Draw border around color box
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.strokeRect(legendStartX, legendY, legendColorSize, legendColorSize);

      // Draw label
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(
        option.label,
        legendStartX + legendColorSize + 15,
        legendY + 20
      );

      // Draw count and percentage
      const percentage = ((option.count / totalCount) * 100).toFixed(1);
      ctx.font = '16px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(
        `${option.count} (${percentage}%)`,
        legendStartX + legendColorSize + 15,
        legendY + 45
      );
    });

    return canvas.toDataURL('image/png');
  }

  /**
   * Generate a detailed PDF report with charts
   */
  static async generateReport(data: ReportData): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let currentY = margin;

    // Helper function to add text with word wrapping
    const addText = (
      text: string,
      fontSize: number,
      isBold = false,
      color = '#000000',
      extraSpacing = 5
    ) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      pdf.setTextColor(color);

      const lines = pdf.splitTextToSize(text, contentWidth);
      pdf.text(lines, margin, currentY);
      currentY += lines.length * (fontSize * 0.35) + extraSpacing;
    };

    // Helper function to add a new page if needed
    const checkNewPage = (requiredSpace: number) => {
      if (currentY + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
    };

    // Title
    addText('Seller Console - Detailed Report', 20, true, '#1f2937');
    addText(
      `Generated on ${data.generatedAt.toLocaleDateString()} at ${data.generatedAt.toLocaleTimeString()}`,
      12,
      false,
      '#6b7280'
    );
    currentY += 5;

    // Executive Summary
    addText('Executive Summary', 14, true, '#1f2937');
    const totalLeads = data.leads.length;
    const totalOpportunities = data.opportunities.length;
    const conversionRate =
      totalLeads > 0
        ? ((totalOpportunities / totalLeads) * 100).toFixed(1)
        : '0.0';
    const totalVolume = data.opportunities.reduce(
      (sum, opp) => sum + (opp.amount || 0),
      0
    );

    addText(
      `Total Leads: ${totalLeads}   |   Total Opportunities: ${totalOpportunities}   |   Conversion Rate: ${conversionRate}%   |   Volume: $${totalVolume.toLocaleString()}`,
      10
    );
    currentY += 5;

    // Leads chart
    if (data.leads.length > 0) {
      // checkNewPage(140);
      addText('Lead Status Distribution', 14, true, '#1f2937', 0);

      const leadChartImage = this.generateChartImage(
        data.leadStatusOptions,
        'lead'
      );

      if (leadChartImage) {
        // Maintain aspect ratio - canvas is 1000x500, so ratio is 2.0
        const maxWidth = contentWidth;
        const aspectRatio = 1000 / 500; // 2.0
        const imgWidth = maxWidth;
        const imgHeight = maxWidth / aspectRatio;

        pdf.addImage(
          leadChartImage,
          'PNG',
          margin,
          currentY,
          imgWidth,
          imgHeight
        );
        currentY += imgHeight + 10;
      }
    }

    // Opportunities chart
    if (data.opportunities.length > 0) {
      // checkNewPage(140);
      addText('Opportunity Stage Distribution', 14, true, '#1f2937', 0);

      const opportunityChartImage = this.generateChartImage(
        data.opportunityStageOptions,
        'opportunity'
      );

      if (opportunityChartImage) {
        // Maintain aspect ratio - canvas is 1000x500, so ratio is 2.0
        const maxWidth = contentWidth;
        const aspectRatio = 1000 / 500; // 2.0
        const imgWidth = maxWidth;
        const imgHeight = maxWidth / aspectRatio;

        pdf.addImage(
          opportunityChartImage,
          'PNG',
          margin,
          currentY,
          imgWidth,
          imgHeight
        );
        currentY += imgHeight + 10;
      }
    }

    // Add some spacing before the detailed tables
    currentY += 10;

    // Lead Details Table
    if (data.leads.length > 0) {
      pdf.addPage();
      currentY = margin;
      addText('Lead Details', 16, true, '#1f2937');

      // Table headers
      const headers = ['Name', 'Company', 'Source', 'Score', 'Status'];
      const colWidths = [40, 40, 30, 20, 30]; // Total: 160mm (fits in contentWidth)
      const rowHeight = 8;

      // Draw header background (no border)
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, currentY - 5, contentWidth, rowHeight, 'F');

      // Draw header text
      let xPos = margin + 5;
      headers.forEach((header, index) => {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor('#374151');
        pdf.text(header, xPos, currentY + 1);
        xPos += colWidths[index];
      });

      currentY += rowHeight;

      // Draw lead data with alternating row colors
      data.leads.forEach((lead, index) => {
        checkNewPage(rowHeight + 2);

        // Alternate row background colors
        if (index % 2 === 0) {
          // Even rows: darker grey background
          pdf.setFillColor(240, 242, 245);
          pdf.rect(margin, currentY - 5, contentWidth, rowHeight, 'F');
        } else {
          // Odd rows: white background
          pdf.setFillColor(255, 255, 255);
          pdf.rect(margin, currentY - 5, contentWidth, rowHeight, 'F');
        }

        // Name in first column
        pdf.setTextColor('#000000');
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(lead.name.substring(0, 20), margin + 5, currentY);

        // Company in second column
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor('#6b7280');
        pdf.text(
          lead.company.substring(0, 20),
          margin + colWidths[0] + 5,
          currentY
        );
        pdf.setTextColor('#000000');

        // Source
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(
          lead.source.substring(0, 15),
          margin + colWidths[0] + colWidths[1] + 5,
          currentY
        );

        // Score
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(
          lead.score.toString(),
          margin + colWidths[0] + colWidths[1] + colWidths[2] + 5,
          currentY
        );

        // Status
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(
          lead.status,
          margin +
            colWidths[0] +
            colWidths[1] +
            colWidths[2] +
            colWidths[3] +
            5,
          currentY
        );

        currentY += rowHeight;
      });
    }

    // Opportunity Details Table
    if (data.opportunities.length > 0) {
      pdf.addPage();
      currentY = margin;
      addText('Opportunity Details', 16, true, '#1f2937');

      // Table headers
      const headers = ['Name', 'Account', 'Stage', 'Amount'];
      const colWidths = [45, 45, 40, 30]; // Total: 160mm (fits in contentWidth)
      const rowHeight = 8;

      // Draw header background (no border)
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, currentY - 5, contentWidth, rowHeight, 'F');

      // Draw header text
      let xPos = margin + 5;
      headers.forEach((header, index) => {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor('#374151');
        pdf.text(header, xPos, currentY + 1);
        xPos += colWidths[index];
      });

      currentY += rowHeight;

      // Draw opportunity data with alternating row colors
      data.opportunities.forEach((opportunity, index) => {
        checkNewPage(rowHeight + 2);

        // Alternate row background colors
        if (index % 2 === 0) {
          // Even rows: darker grey background
          pdf.setFillColor(240, 242, 245);
          pdf.rect(margin, currentY - 5, contentWidth, rowHeight, 'F');
        } else {
          // Odd rows: white background
          pdf.setFillColor(255, 255, 255);
          pdf.rect(margin, currentY - 5, contentWidth, rowHeight, 'F');
        }

        // Name in first column
        pdf.setTextColor('#000000');
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(opportunity.name.substring(0, 25), margin + 5, currentY);

        // Account in second column
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor('#6b7280');
        pdf.text(
          opportunity.accountName.substring(0, 25),
          margin + colWidths[0] + 5,
          currentY
        );
        pdf.setTextColor('#000000');

        // Stage
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(
          opportunity.stage,
          margin + colWidths[0] + colWidths[1] + 5,
          currentY
        );

        // Amount
        const amountText = opportunity.amount
          ? `$${opportunity.amount.toLocaleString()}`
          : 'N/A';
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(
          amountText,
          margin + colWidths[0] + colWidths[1] + colWidths[2] + 5,
          currentY
        );

        currentY += rowHeight;
      });
    }

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor('#6b7280');
    pdf.text('Generated by Seller Console', margin, pageHeight - 10);
    pdf.text(
      `Page ${pdf.getCurrentPageInfo().pageNumber}`,
      pageWidth - margin - 20,
      pageHeight - 10
    );

    // Save the PDF
    const fileName = `seller-console-report-${data.generatedAt.toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }
}
