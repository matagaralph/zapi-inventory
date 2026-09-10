---
'zapi-inventory': patch
---

Fixed addAttachment and getAttachment/getDocument on invoices, credit notes, retainer invoices, tasks and move orders. They now send files as multipart form data and return the downloaded file as a Blob, matching items, delivery challans, purchase receives and putaways. Before this fix no file bytes were ever sent or returned on these five modules.
