export class RequirementData {
    private static priorities = ['High', 'Medium', 'Low'];

    static getRandomPriority(): string {
        return this.priorities[Math.floor(Math.random() * this.priorities.length)];
    }

    static getRandomFutureDate(minDays: number = 1, maxDays: number = 28): Date {
        const today = new Date();
        const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + randomDays);
        return futureDate;
    }

    static generateRequirementData() {
        // Generate due date and reviewer due date so reviewerDueDate is always after dueDate
        const dueDateObj = this.getRandomFutureDate(1, 15);
        const reviewerDueDateObj = this.getRandomFutureDate(16, 28);
        // If reviewerDueDate is not after dueDate, adjust
        let dueDate = dueDateObj.getDate();
        let reviewerDueDate = reviewerDueDateObj.getDate();
        if (reviewerDueDate <= dueDate) {
            reviewerDueDate = dueDate + 1;
        }
        return {
            priority: this.getRandomPriority(),
            category: "Automation",
            dataRequirement: "QA testing",
            requirementTitle: `Auto Req ${new Date().getTime()}`,
            dueDate: dueDate.toString(),
            reviewerDueDate: reviewerDueDate.toString()
        };
    }
}