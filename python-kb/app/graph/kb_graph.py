from typing import TypedDict

from langgraph.graph import END, StateGraph


class KnowledgeBaseState(TypedDict, total=False):
    question: str
    rewritten_question: str
    context: list[str]
    answer: str


async def rewrite_question(state: KnowledgeBaseState) -> KnowledgeBaseState:
    question = state["question"].strip()
    return {"rewritten_question": question}


async def retrieve_context(state: KnowledgeBaseState) -> KnowledgeBaseState:
    question = state.get("rewritten_question") or state["question"]
    return {"context": [f"TODO: retrieve knowledge-base chunks for: {question}"]}


async def generate_answer(state: KnowledgeBaseState) -> KnowledgeBaseState:
    question = state.get("rewritten_question") or state["question"]
    context = "\n".join(state.get("context", []))
    answer = (
        "Knowledge-base service initialized. "
        f"Question: {question}. "
        f"Context: {context}"
    )
    return {"answer": answer}


def build_kb_graph():
    graph = StateGraph(KnowledgeBaseState)
    graph.add_node("rewrite_question", rewrite_question)
    graph.add_node("retrieve_context", retrieve_context)
    graph.add_node("generate_answer", generate_answer)

    graph.set_entry_point("rewrite_question")
    graph.add_edge("rewrite_question", "retrieve_context")
    graph.add_edge("retrieve_context", "generate_answer")
    graph.add_edge("generate_answer", END)

    return graph.compile()


kb_graph = build_kb_graph()


async def run_kb_graph(question: str) -> dict[str, object]:
    result = await kb_graph.ainvoke({"question": question})
    return {
        "question": question,
        "answer": result["answer"],
        "context": result.get("context", []),
    }
