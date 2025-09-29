

```markdown
# Payment Gateway com PIX e Clean Architecture

## 📄 Descrição do Projeto
Este projeto implementa um **gateway de pagamento com PIX**, integrado ao **Mercado Pago**, utilizando o framework **NestJS** e seguindo os princípios da **Clean Architecture**.  
O sistema foi projetado para ser **modular**, **testável**, **escalável** e **independente de tecnologias externas**, permitindo fácil manutenção e troca de provedores de pagamento (ex.: Mercado Pago por PagSeguro).

### Funcionalidades principais:
- **Criação de pagamentos PIX**: Gera um código PIX e QR Code para transações instantâneas.  
- **Consulta de status de pagamento**: Verifica se um pagamento foi concluído.  

A arquitetura é dividida em camadas (`Domain`, `Application`, `Infrastructure`, `Presentation`), garantindo separação de responsabilidades e aderência às boas práticas de desenvolvimento.

---

## 🛠️ Tecnologias Utilizadas
- **Linguagem:** TypeScript  
- **Framework:** NestJS  
- **Bibliotecas Principais:**
  - `mercadopago`: SDK para integração com o Mercado Pago.
  - `@nestjs/config`: Gerenciamento de variáveis de ambiente.
  - `@nestjs/swagger`: Documentação de API com Swagger.
  - `jest`: Framework de testes unitários.
- **Arquitetura:** Clean Architecture  
- **Ferramentas de Teste:** Jest, @nestjs/testing  
- **Documentação:** Swagger/OpenAPI  
- **Gerenciamento de Dependências:** npm  

---

## 📂 Estrutura do Projeto
O projeto segue a organização da **Clean Architecture**, com as seguintes camadas:

src/
├── Payment/
│   ├── Application/             # Camada de aplicação (casos de uso)
│   │   ├── dtos/                # DTOs para transferência de dados
│   │   └── use-cases/           # Casos de uso (CreatePixUseCase, CheckPaymentStatusUseCase)
│   ├── Domain/                  # Camada de domínio (regras de negócio)
│   │   ├── entities/            # Entidades de negócio (Payment)
│   │   └── interfaces/          # Interfaces (IPaymentRepository)
│   ├── Infrastructure/          # Camada de infraestrutura (implementações externas)
│   │   └── services/            # Serviços externos (MercadoPagoService)
│   └── Presentation/            # Camada de apresentação (API, controladores)
│       └── controllers/         # Controladores REST (PaymentController)
├── tests/                       # Testes unitários das camadas
├── README.md                     # Documentação do projeto
├── package.json                  # Configuração de dependências
└── tsconfig.json                 # Configuração do TypeScript


---

## 🏗️ Camadas da Clean Architecture
- **Domain**: Contém entidades (`Payment`) e interfaces (`IPaymentRepository`) com as regras de negócio. Independente de frameworks ou serviços externos.  
- **Application**: Inclui casos de uso (`CreatePixUseCase`, `CheckPaymentStatusUseCase`) que orquestram a lógica de negócio, validando entradas e delegando operações ao repositório.  
- **Infrastructure**: Implementa as interfaces do domínio, conectando-se a serviços externos como o Mercado Pago (`MercadoPagoService`).  
- **Presentation**: Expõe a API REST com controladores (`PaymentController`) e documentação Swagger.

### Exemplo de Entidade Payment (Domain Layer)
```typescript
export class Payment {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly description: string,
    public readonly email: string,
    public readonly status: string,
    public readonly pixCode?: string,
    public readonly qrCodeBase64?: string,
  ) {
    if (amount <= 0) throw new Error('Amount must be greater than zero');
    if (!description) throw new Error('Description is required');
    if (!email.includes('@')) throw new Error('Invalid email format');
  }

  isPaid(): boolean {
    return this.status.toLowerCase() === 'paid' || this.status.toLowerCase() === 'concluded';
  }
}
````

### Exemplo de Caso de Uso CreatePixUseCase (Application Layer)

```typescript
export class CreatePixUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}
  async execute(input: InputCreatePixDto): Promise<OutputCreatePixDto> {
    if (!input.amount || !input.description || !input.email) {
      throw new Error('Missing required fields');
    }
    return this.paymentRepository.createPix(input);
  }
}
```

---

## ⚙️ Pré-requisitos

* Node.js (versão 18 ou superior)
* npm (versão 9 ou superior)
* Mercado Pago Access Token (teste ou produção)

---

## 🚀 Configuração do Ambiente

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/payment-gateway-pix.git
cd payment-gateway-pix
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo **.env** na raiz do projeto:

```
MP_ACCESS_TOKEN=seu_access_token_do_mercado_pago
PORT=3000
```

4. **Inicie o servidor:**

```bash
npm run start:dev
```

5. **Acesse a documentação Swagger:**
   [http://localhost:3000/api](http://localhost:3000/api)

---

## 🌐 Endpoints da API

|   Método | Endpoint                   | Descrição                         | Entrada (Body/Params)                            | Saída                                                  |
| -------: | -------------------------- | --------------------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| **POST** | `/payments/pix`            | Cria um pagamento PIX             | `InputCreatePixDto` (amount, description, email) | `OutputCreatePixDto` (id, pixCode, qrCodeBase64, etc.) |
|  **GET** | `/payments/pix/:paymentId` | Consulta o status de um pagamento | `paymentId` (param)                              | `OutputPaymentStatusDto` (paymentId, status)           |

### Exemplo de Requisição (Criação de PIX)

```bash
curl -X POST http://localhost:3000/payments/pix \
-H "Content-Type: application/json" \
-d '{"amount": 100, "description": "Curso Node", "email": "cliente@email.com"}'
```

**Resposta:**

```json
{
  "id": "123",
  "amount": 100,
  "description": "Curso Node",
  "email": "cliente@email.com",
  "status": "pending",
  "pixCode": "abc",
  "qrCodeBase64": "xyz"
}
```

---

## 🧪 Testes

O projeto inclui **testes unitários** usando Jest, cobrindo todas as camadas.

### Executando os testes:

```bash
npm run test
```

### Exemplos de teste

```typescript
describe('CreatePixUseCase', () => {
  it('should throw error if required fields are missing', async () => {
    await expect(
      createPixUseCase.execute({ amount: 0, description: '', email: '' }),
    ).rejects.toThrow('Missing required fields');
  });
});
```

---

## 🌟 Benefícios da Clean Architecture

* **Desacoplamento**: Trocar o provedor de pagamento exige apenas uma nova implementação de `IPaymentRepository`.
* **Testabilidade**: Testes unitários isolam camadas e permitem mocks de serviços externos.
* **Manutenibilidade**: Regras de negócio centralizadas no domínio facilitam alterações.
* **Escalabilidade**: Novas funcionalidades podem ser adicionadas sem quebrar o design.

---

## 🔮 Possíveis Melhorias

* **Webhooks**: Adicionar notificações assíncronas do Mercado Pago.
* **Validações Avançadas**: Regras adicionais na entidade `Payment` (limites de valor).
* **Cache**: Consultas frequentes de status podem ser armazenadas em cache.
* **Outros Provedores**: Criar adaptadores para PagSeguro, Stripe, etc.

---

## 🤝 Contribuição

1. Faça um **fork** do repositório.
2. Crie uma branch para sua feature:

```bash
git checkout -b minha-feature
```

3. Commit suas alterações:

```bash
git commit -m "Adiciona minha feature"
```

4. Envie para o repositório remoto:

```bash
git push origin minha-feature
```

5. Abra um **Pull Request**.

---

## 📧 Contato

Para dúvidas ou sugestões, entre em contato via **[santosray62@example.com](santosray62@example.com)** ou abra uma *issue* no repositório.

```
