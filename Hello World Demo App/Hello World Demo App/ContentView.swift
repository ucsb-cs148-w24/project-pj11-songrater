//
//  ContentView.swift
//  Hello World Demo App
//
//  Created by Katyayani G. Raman on 1/19/24.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack {
                    Image(systemName: "globe")
                        .imageScale(.large)
                        .foregroundStyle(.tint)
                    Text("Hello, world!")
                }
            }
            .padding()
            .navigationTitle("Demo App")
        }
    }
}

#Preview {
    ContentView()
}
