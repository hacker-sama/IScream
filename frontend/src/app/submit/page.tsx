export default function SubmitRecipePage() {
  return (
    <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-8 bg-background-light dark:bg-background-dark text-[#181112] font-display min-h-screen flex-col">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        {/* Page Heading */}
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <h1 className="text-[#181112] dark:text-white text-4xl sm:text-5xl font-black leading-tight tracking-[-0.033em]">
            Share Your <span className="text-primary">Scoop!</span>
          </h1>
          <p className="text-[#896169] dark:text-[#ccb0b6] text-lg font-normal leading-normal max-w-xl mx-auto sm:mx-0">
            Get featured on Mr. A&apos;s menu! Fill out the details below to share your sweetest creation with the world.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-[#1a0c0f] rounded-lg shadow-sm p-6 sm:p-8 flex flex-col gap-8 border border-[#f0ebec] dark:border-[#3a2025]">
          {/* Recipe Name */}
          <div className="flex flex-col gap-2">
            <label
              className="text-[#181112] dark:text-gray-100 text-base font-bold leading-normal"
              htmlFor="recipe-name"
            >
              What do you call this masterpiece?
            </label>
            <input
              id="recipe-name"
              type="text"
              placeholder="e.g., 'Midnight Fudge Explosion'"
              className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-full text-[#181112] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#e6dbdd] dark:border-[#4a2e34] bg-white dark:bg-[#2a151a] focus:border-primary h-14 placeholder:text-[#896169] px-6 text-base font-normal leading-normal transition-all"
            />
          </div>

          {/* Description/Story */}
          <div className="flex flex-col gap-2">
            <label
              className="text-[#181112] dark:text-gray-100 text-base font-bold leading-normal"
              htmlFor="recipe-desc"
            >
              What&apos;s the story behind it?
            </label>
            <textarea
              id="recipe-desc"
              rows={3}
              placeholder="Tell us what inspired this flavor..."
              className="form-textarea flex w-full min-w-0 resize-none rounded-2xl text-[#181112] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#e6dbdd] dark:border-[#4a2e34] bg-white dark:bg-[#2a151a] focus:border-primary placeholder:text-[#896169] p-6 text-base font-normal leading-normal transition-all"
            />
          </div>

          {/* Ingredients Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[#181112] dark:text-gray-100 text-base font-bold leading-normal">
                What goes into the mix?
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {/* Row 1 */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3 items-start">
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    placeholder="Amount (e.g. 2 scoops)"
                    className="form-input w-full rounded-full text-[#181112] dark:text-white focus:ring-2 focus:ring-primary/20 border border-[#e6dbdd] dark:border-[#4a2e34] bg-white dark:bg-[#2a151a] focus:border-primary h-12 placeholder:text-[#896169] px-5 text-base"
                  />
                </div>
                <div className="w-full sm:w-2/3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Ingredient (e.g. Vanilla Bean)"
                    className="form-input w-full rounded-full text-[#181112] dark:text-white focus:ring-2 focus:ring-primary/20 border border-[#e6dbdd] dark:border-[#4a2e34] bg-white dark:bg-[#2a151a] focus:border-primary h-12 placeholder:text-[#896169] px-5 text-base"
                  />
                  <button
                    type="button"
                    className="shrink-0 size-12 flex items-center justify-center text-[#896169] hover:text-primary hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    aria-label="Delete ingredient"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3 items-start">
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    placeholder="Amount"
                    className="form-input w-full rounded-full text-[#181112] dark:text-white focus:ring-2 focus:ring-primary/20 border border-[#e6dbdd] dark:border-[#4a2e34] bg-white dark:bg-[#2a151a] focus:border-primary h-12 placeholder:text-[#896169] px-5 text-base"
                  />
                </div>
                <div className="w-full sm:w-2/3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Ingredient"
                    className="form-input w-full rounded-full text-[#181112] dark:text-white focus:ring-2 focus:ring-primary/20 border border-[#e6dbdd] dark:border-[#4a2e34] bg-white dark:bg-[#2a151a] focus:border-primary h-12 placeholder:text-[#896169] px-5 text-base"
                  />
                  <button
                    type="button"
                    className="shrink-0 size-12 flex items-center justify-center text-[#896169] hover:text-primary hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    aria-label="Delete ingredient"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="flex w-max cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-transparent text-primary hover:bg-red-50 dark:hover:bg-red-900/20 gap-2 pl-4 text-sm font-bold leading-normal tracking-[0.015em] transition-colors self-start -ml-4 mt-2"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span className="truncate">Add Another Ingredient</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="flex flex-col gap-2">
            <label
              className="text-[#181112] dark:text-gray-100 text-base font-bold leading-normal"
              htmlFor="instructions"
            >
              How do we make it?
            </label>

            <div className="relative">
              {/* Toolbar Simulation */}
              <div className="absolute top-2 left-2 flex gap-1 p-2 bg-transparent z-10">
                <button
                  type="button"
                  className="size-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-[#896169]"
                  aria-label="Bold"
                >
                  <span className="material-symbols-outlined text-[18px]">format_bold</span>
                </button>
                <button
                  type="button"
                  className="size-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-[#896169]"
                  aria-label="Italic"
                >
                  <span className="material-symbols-outlined text-[18px]">format_italic</span>
                </button>
                <button
                  type="button"
                  className="size-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-[#896169]"
                  aria-label="Bulleted list"
                >
                  <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                </button>
              </div>

              <textarea
                id="instructions"
                rows={6}
                placeholder="Step 1: Mix the magic dust with..."
                className="form-textarea flex w-full min-w-0 resize-y rounded-2xl text-[#181112] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#e6dbdd] dark:border-[#4a2e34] bg-white dark:bg-[#2a151a] focus:border-primary placeholder:text-[#896169] pt-14 px-6 pb-6 text-base font-normal leading-normal transition-all"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <span className="text-[#181112] dark:text-gray-100 text-base font-bold leading-normal">
              Show us the goods!
            </span>

            <div className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#e6dbdd] dark:border-[#4a2e34] rounded-2xl bg-gray-50 dark:bg-[#1f1215] hover:bg-red-50 dark:hover:bg-[#2d161b] hover:border-primary transition-all cursor-pointer overflow-hidden">
              <input
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                type="file"
                aria-label="Upload image"
              />
              <div className="flex flex-col items-center gap-3 text-center transition-transform group-hover:scale-105">
                <div className="size-16 rounded-full bg-white dark:bg-[#2a151a] shadow-sm flex items-center justify-center text-primary mb-2">
                  <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                </div>
                <p className="text-[#181112] dark:text-white font-medium">Click to upload or drag and drop</p>
                <p className="text-[#896169] text-sm">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              className="flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 bg-primary hover:bg-[#d92348] hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all text-white text-lg font-bold leading-normal tracking-[0.015em] w-full sm:w-auto"
            >
              <span className="truncate">Submit Recipe</span>
              <span className="material-symbols-outlined ml-2">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Terms text */}
        <p className="text-center text-[#896169] text-sm">
          By submitting, you agree to Mr. A&apos;s{" "}
          <a className="underline hover:text-primary" href="#">
            Community Guidelines
          </a>
          .
        </p>
      </div>
    </main>
  );
}