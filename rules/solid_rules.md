# SOLID Principles Guide

All agents must adhere to SOLID principles where applicable, especially the Frontend Agent when building React components and hooks.

1. **Single Responsibility Principle (SRP):** A component or function should do one thing. (e.g., The timer logic should be in a custom hook, not inside the UI component).
2. **Open/Closed Principle (OCP):** Software entities should be open for extension, but closed for modification. 
3. **Liskov Substitution Principle (LSP):** Subtypes must be substitutable for their base types.
4. **Interface Segregation Principle (ISP):** Do not force components to depend on interfaces they do not use. Keep props minimal and specific.
5. **Dependency Inversion Principle (DIP):** Depend upon abstractions, not concretions. (e.g., Abstract the Supabase API calls behind service functions rather than calling them directly inside UI components).