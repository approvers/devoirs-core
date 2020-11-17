const { createChromium, createDevoirsClient, AutomaticAuthorizer } = require('devoirs-core');

const chromium = createChromium({
  dataDirPath: './data',
});

const authorizer = new AutomaticAuthorizer(
  chromium,
  process.env.MICROSOFT_EMAIL,
  process.env.MICROSOFT_PASSWORD,
);

let token = null;
const tokenProvider = {
  get() {
    return token ? Promise.resolve(token) : this.refresh();
  },
  async refresh() {
    return token = await authorizer.authorize();
  },
};

const client = createDevoirsClient({
  tokenProvider,
});

(async () => {
  for (const course of await client.getClasses()) {
    console.log(`- [${course.id}] ${course.name}`);

    for (const assignment of await client.getAssignments(course.id)) {
      console.log(`\t- [${assignment.isCompleted ? 'X' : ' '}] ${assignment.displayName} (${assignment.dueDateTime})`);
    }
  }
})()
  .catch(console.error)
;
