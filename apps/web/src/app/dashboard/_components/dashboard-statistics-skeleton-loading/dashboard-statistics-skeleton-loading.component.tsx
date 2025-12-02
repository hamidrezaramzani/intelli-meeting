export const DashboardStatisticsSkeletonLoading = () => (
  <div className="flex gap-3 justify-between">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        className="flex items-center w-1/3 justify-center h-56 max-w-sm bg-slate-100 rounded-md animate-pulse"
        role="status"
        // eslint-disable-next-line perfectionist/sort-jsx-props, @eslint-react/no-array-index-key
        key={i}
      >
        <svg
          height="24"
          width="24"
          aria-hidden="true"
          className="w-11 h-11 text-fg-disabled"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZM9 12h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Zm5.697 2.395v-.733l1.269-1.219v2.984l-1.268-1.032Z"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </div>
    ))}
  </div>
);
