const columns = [
  { name: "ID", uid: "id" },
  { name: "TITLE", uid: "title" },
  { name: "LAST UPDATED", uid: "lastUpdated", sortable: true },
  { name: "VIEWS", uid: "views", sortable: true },
  { name: "LIKES", uid: "likes", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];

export { columns, statusOptions };
