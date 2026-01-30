---
sidebar_position: 1
---

# 📘 Customized Invoice Numbers

The application provides customers with the ability to define **customized invoice number formats.** This ensures invoices are uniquely identifiable while aligning with company branding, compliance requirements, or personal preferences.

### 1. Navigate to the settings -> Invoicing

-Enable the Use Invoicing Format checkbox
-Click on the **i icon** in the Invoice Num Format

### 2. Sample Invoice Formats

**Below are examples of how invoice numbers can be customized:**

**1.Format: AOT%1$tY%1$tm%2$04d Sample Output: AOT2022100001**

**Prefix:** AOT
**Year:** 2022
**Month:** 10 (October)
**Sequence:** 0001 (4 digits, zero-padded)

**2.Format: ABC%1$Tb%1$ty-%2$04d Sample Output: ABCOCT22-0001**

**Prefix:** ABC
**Month abbreviation:** OCT
**Year** (last two digits): 22
**Sequence:** 0001 (4 digits, zero-padded)

**3.Format: FJB%1$ty%1$tm-%2$03d Sample Output: FJB2211-001**

**Prefix:** FJB
**Year** (last two digits): 22
**Month:** 11 (November)
**Sequence:** 001 (3 digits, zero-padded)

### 3. Placeholder Reference Guide

The following table explains each placeholder used in invoice formats:

**Placeholder	Meaning	Example Output**
%1$tY	Full year (4 digits)	2022
%1$ty	Year (last 2 digits)	22
%1$tm	Month (2 digits, zero-padded)	10, 11
%1$Tb	Month abbreviation (uppercase, 3 letters)	OCT, NOV
%2$04d	Sequence number, 4 digits with leading zeros	0001, 0002
%2$03d	Sequence number, 3 digits with leading zeros	001, 002


✅ With this guide, customers can confidently configure invoice numbering formats that are clear, professional, and compliant with business needs.