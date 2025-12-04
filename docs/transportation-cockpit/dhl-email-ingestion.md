---
sidebar_position: 2
---
# DHL Email Ingestion

This guide explains how to integrate DHL Email Ingestion.

import VideoModal from '@site/src/components/VideoModal.js';

<VideoModal
  linkText="Watch Video"
  title="YouTube Video"
  iframeSrc="https://www.youtube.com/embed/6nVeaaH80do?si=Uc6PMVTthHPXKvvD"
/>
---

# Steps

1. In the **Create Booking** form, select the required details such as **Customer**, **Product Type**, **Pickup**, **Delivery**, **Shipping/DO Ref No**, etc.  
        ![Booking Product Type](/img/DHL_product_type_booking.png)
2. Once planning and delivery are completed, the process continues to the **POD and Claims** page.

        ![POD Send Mail](/img/DHL_pod_send_mail.png)
3. Enter the **Shipping/DO Ref No** and Status, then upload the file. Once you click **Send Notification**, the customer will receive an email with the specified subject format and the file attached.

        ![POD Mail](/img/DHL_pod_mail_sample.png)

### Important Note:

-First select the **DHL Type Customer** checkbox, and ensure that the **Send POD as Link** checkbox in the **Customer Form** within the **System Master** is **not selected**.

-Only then will the customer receive the **POD email as a PDF** attachment instead of a link, with the specified subject format.
     
        ![POD link Disable](/img/send_pod_link_disabled.png)
