// Unimplemented reference sketch; not part of the running agent.
// const model = process.env.OPENAI_MODEL;
//
// async function answerFromDocs(question: string) {
//     const queryEmbeddings = await embed(question);
//     const chunks = await vectorStore.search(queryEmbeddings, 5);
//     const context = chunks.map(chunk => chunk.text).join("\n\n");
//     const response = await model.generate({
//         instructions: `Answeer only from the supplied context. If the answer is not present, say you dont know`.trim(),
//         input: `
//             Context: ${context},
//             Question: ${question}
//         `.trim(),
//     })
//
//     return response
// };
